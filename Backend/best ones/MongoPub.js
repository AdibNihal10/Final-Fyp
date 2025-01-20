// File: publications2.js
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Scholar = require("./scholarModel"); // Import the MongoDB model

async function scrapeUTMScholar() {
  // Connect to MongoDB
  await mongoose.connect("mongodb://127.0.0.1:27017/utm_scholars");

  console.log("Connected to MongoDB");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  let allScholarLinks = [];

  console.log("Navigating to the faculty page...");
  await page.goto("https://utmscholar.utm.my/faculties/28", {
    waitUntil: "networkidle2",
  });

  let pageNumber = 1;

  // Step 1: Gather all links across all pages (pagination)
  while (true) {
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
    if (!nextButton) {
      console.log("Next button not found, all pages processed.");
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
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }),
      ]);
    } catch (navError) {
      console.error("Navigation error:", navError);
      console.log("Retrying next button click...");
    }

    pageNumber++;
  }

  console.log(`Total scholar links collected: ${allScholarLinks.length}`);

  // Step 2: Visit each scholar link to scrape data
  for (const link of allScholarLinks) {
    console.log(`Navigating to scholar page: ${link}`);

    let retryCount = 0;
    let scholarData = null;

    while (
      retryCount < 3 &&
      (!scholarData || Object.keys(scholarData).length === 0)
    ) {
      try {
        await page.goto(link, {
          waitUntil: ["networkidle0", "domcontentloaded"],
          timeout: 30000,
        });

        console.log("Extracting data from scholar page...");

        scholarData = await page.evaluate(() => {
          const extractNumber = (element) => {
            if (!element) return 0;
            const text = element.textContent.trim();
            if (!text) return 0;
            const number = parseInt(text.replace(/\D/g, ""), 10);
            return isNaN(number) ? 0 : number;
          };

          const dataObj = {};

          const textWhiteDivs = Array.from(
            document.querySelectorAll(".text-white")
          );
          textWhiteDivs.forEach((div) => {
            if (!div) return;

            const heading = div.querySelector("h6");
            const valueElement = div.querySelector("h2");

            if (heading && valueElement) {
              const headingText = heading.textContent.trim();
              const value = extractNumber(valueElement);
              if (headingText && value !== undefined) {
                dataObj[headingText] = value;
              }
            }
          });

          const hIndexElement = document.querySelector("#hIndexID");
          if (hIndexElement) {
            dataObj["H-INDEXED (SCOPUS)"] = extractNumber(hIndexElement);
          }

          const citationsElement = document.querySelector(
            "#CountPublicIndexID"
          );
          if (citationsElement) {
            dataObj["CITATIONS (SCOPUS)"] = extractNumber(citationsElement);
          }

          return dataObj;
        });

        if (scholarData && Object.keys(scholarData).length > 0) {
          console.log(`Data extracted from ${link}:`, scholarData);

          // Step 3: Insert data into MongoDB
          await Scholar.create({
            link,
            ...scholarData,
          });
          console.log(`Data inserted for ${link}`);
        } else {
          throw new Error("No meaningful data extracted");
        }
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
      }
    }
  }

  console.log("All scholar data has been scraped and inserted.");
  await browser.close();
  await mongoose.connection.close();
}

scrapeUTMScholar().catch(console.error);
