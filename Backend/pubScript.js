const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Scholar = require("./Model/pubModel"); // Import the MongoDB model

async function scrapeUTMScholar() {
  // Connect to MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/scholars_updated");
  console.log("Connected to MongoDB");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  let allScholarLinks = [];
  let timeoutReached = false;

  // Set a timer to stop the script after 4 minutes
  const timeout = setTimeout(() => {
    timeoutReached = true;
    console.log("Timeout reached: Stopping the scraping process.");
  }, 5 * 60 * 1000); // 4 minutes in milliseconds

  console.log("Navigating to the faculty page...");
  await page.goto("https://utmscholar.utm.my/faculties/28", {
    waitUntil: "networkidle2",
  });

  let pageNumber = 1;

  try {
    // Step 1: Gather all links across all pages (pagination)
    while (!timeoutReached) {
      console.log(`Extracting scholar links from page ${pageNumber}...`);

      const scholarLinks = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll(
            "#FacultyListofScholars #ListScholarFacultyDashboard tbody tr"
          )
        );
        return rows
          .map((row) => {
            const anchorTag = row.querySelector("td a");
            return anchorTag ? anchorTag.href : null;
          })
          .filter((link) => link);
      });

      console.log(
        `Found ${scholarLinks.length} scholar links on page ${pageNumber}.`
      );
      allScholarLinks.push(...scholarLinks);

      const nextButton = await page.$("#ListScholarFacultyDashboard_next");
      if (!nextButton || timeoutReached) {
        console.log("Next button not found or timeout reached, stopping.");
        break;
      }

      const isDisabled = await page.evaluate(
        (button) =>
          button.classList.contains("disabled") ||
          button.getAttribute("aria-disabled") === "true",
        nextButton
      );

      if (isDisabled) {
        console.log("Reached the last page, stopping pagination.");
        break;
      }

      await page.evaluate((button) => {
        button.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, nextButton);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await Promise.all([
          page.evaluate((button) => button.click(), nextButton),
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 1000 }),
        ]);
      } catch (navError) {
        console.error("Navigation error:", navError);
        console.log("Retrying next button click...");
      }

      pageNumber++;
    }

    console.log(`Total scholar links collected: ${allScholarLinks.length}`);

    // Step 2: Visit each scholar link to scrape Research Group, Grants, and Publications data
    for (const link of allScholarLinks) {
      if (timeoutReached) break;

      console.log(`Navigating to scholar page: ${link}`);

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await page.goto(link, {
            waitUntil: ["networkidle0", "domcontentloaded"],
            timeout: 20000, // Reduced timeout
          });

          if (timeoutReached) break;

          // Wait for the page to load
          await page.waitForSelector(".page-title-box h4", { timeout: 20000 });

          // Step 2.1: Extract Scholar Name
          const scholarName = await page.evaluate(() => {
            const nameElement = document.querySelector(".page-title-box h4");
            return nameElement ? nameElement.textContent.trim() : "N/A";
          });

          console.log(`Scholar Name: ${scholarName}`);

          // Step 2.2: Extract Research Group Data
          const researchGroup = await page.evaluate(() => {
            const sidebarMenu = document.querySelector("#sidebar-menu");
            if (!sidebarMenu) return "N/A";

            const researchGroupElement = sidebarMenu.querySelector(
              "a[href*='research-groups'] span"
            );
            if (researchGroupElement) {
              return researchGroupElement.innerText.trim().replace("\n", " ");
            }

            return "N/A";
          });

          console.log(`Research Group for ${link}: ${researchGroup}`);

          // Step 2.3: Navigate to Publications Tab
          await page.evaluate(() => {
            const publicationsTab = document.querySelector(
              'a[href="#publication_tab"]'
            );
            if (publicationsTab) publicationsTab.click();
          });

          // Wait for the Publications tab to load
          await page.waitForSelector(
            "#publication_tab #publicationListTablePersonalDatatable_wrapper",
            {
              timeout: 20000,
            }
          );

          // Step 2.4: Extract Publications Data
          const publicationsData = await page.evaluate(() => {
            const tableBody = document.querySelector(
              "#publicationListTablePersonalDatatable tbody"
            );
            if (!tableBody) return null;

            const rows = Array.from(tableBody.querySelectorAll("tr"));
            const totalJournals = rows.length;

            const data = rows.map((row) => {
              const cells = Array.from(row.querySelectorAll("td"));
              const journalName =
                cells[0]?.querySelector("a")?.textContent.trim() || "N/A"; // Extract journal name from <a>
              const publicationCategory =
                cells[0].querySelector(".badge.bg-info")?.textContent.trim() ||
                "N/A";
              const typeOfAuthors =
                cells[0]
                  .querySelector(".badge.bg-success")
                  ?.textContent.trim() || "N/A";
              const year = cells[1]?.textContent.trim() || "N/A"; // Extract year from the second cell

              return {
                journalName,
                publicationCategory,
                typeOfAuthors,
                year, // Include year
              };
            });

            return { totalJournals, data };
          });

          console.log(`Publications Data for ${link}:`, publicationsData);

          // Save the data into the database
          const scholarData = {
            link: link,
            name: scholarName,
            researchGroup: researchGroup, // Save Research Group data
            totalJournals: publicationsData.totalJournals,
            publications: publicationsData.data,
          };

          await Scholar.replaceOne({ link }, scholarData, { upsert: true });
          console.log(`Data saved for ${link}`);
          break; // Exit retry loop if successful
        } catch (error) {
          retryCount++;
          console.error(`Retry ${retryCount} for ${link}`);
          if (retryCount === maxRetries) {
            console.error(`Failed after ${maxRetries} attempts:`, error);
          }
        }
      }
    }

    console.log("Scraping process completed.");
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  } finally {
    clearTimeout(timeout); // Clear timeout to avoid memory leaks
    await browser.close();
    await mongoose.connection.close();
    console.log("Browser and database connection closed.");
  }
}

// AutoScroll function
async function autoScroll(page) {
  await page.evaluate(async () => {
    const distance = 100;
    let totalHeight = 0;
    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, distance);
      totalHeight += distance;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
}

scrapeUTMScholar().catch(console.error);
