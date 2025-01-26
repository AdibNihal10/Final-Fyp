// const puppeteer = require("puppeteer");
// const Scholar = require("./Model/ipModel"); // Import the MongoDB model

// async function IPscrapeUTMScholar() {
//   let browser;
//   let timeout; // Declare timeout variable

//   try {
//     console.log("Starting scraping process for Intellectual Property...");

//     // Launch Puppeteer
//     browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: false,
//       userDataDir: "./tmp",
//     });

//     const page = await browser.newPage();
//     let allScholarLinks = [];
//     let timeoutReached = false;

//     // Set a timer to stop the script after 10 minutes
//     timeout = setTimeout(() => {
//       timeoutReached = true;
//       console.log("Timeout reached: Stopping the scraping process.");
//     }, 10 * 60 * 1000);

//     console.log("Navigating to the faculty page...");
//     await page.goto("https://utmscholar.utm.my/faculties/28", {
//       waitUntil: "networkidle2",
//     });

//     let pageNumber = 1;

//     // Step 1: Gather all links across all pages (pagination)
//     while (!timeoutReached) {
//       console.log(`Extracting scholar links from page ${pageNumber}...`);

//       // Use autoScroll to ensure all content is fully loaded
//       await autoScroll(page);

//       const scholarLinks = await page.evaluate(() => {
//         const rows = Array.from(
//           document.querySelectorAll(
//             "#FacultyListofScholars #ListScholarFacultyDashboard tbody tr"
//           )
//         );
//         return rows
//           .map((row) => {
//             const anchorTag = row.querySelector("td a");
//             return anchorTag ? anchorTag.href : null;
//           })
//           .filter((link) => link);
//       });

//       console.log(
//         `Found ${scholarLinks.length} scholar links on page ${pageNumber}.`
//       );
//       allScholarLinks.push(...scholarLinks);

//       const nextButton = await page.$("#ListScholarFacultyDashboard_next");
//       if (!nextButton || timeoutReached) {
//         console.log("Next button not found or timeout reached, stopping.");
//         break;
//       }

//       const isDisabled = await page.evaluate(
//         (button) =>
//           button.classList.contains("disabled") ||
//           button.getAttribute("aria-disabled") === "true",
//         nextButton
//       );

//       if (isDisabled) {
//         console.log("Reached the last page, stopping pagination.");
//         break;
//       }

//       await page.evaluate((button) => {
//         button.scrollIntoView({
//           behavior: "smooth",
//           block: "end",
//           inline: "nearest",
//         });
//       }, nextButton);

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       try {
//         await Promise.all([
//           page.evaluate((button) => button.click(), nextButton),
//           page.waitForNavigation({ waitUntil: "networkidle2", timeout: 1000 }),
//         ]);
//       } catch (navError) {
//         console.log("Retrying next button click...");
//       }

//       pageNumber++;
//     }

//     console.log(`Total scholar links collected: ${allScholarLinks.length}`);

//     // Step 2: Visit each scholar link to scrape Intellectual Property and Research Group data
//     for (const link of allScholarLinks) {
//       if (timeoutReached) break;

//       console.log(`Navigating to scholar page: ${link}`);

//       let retryCount = 0;
//       const maxRetries = 3;

//       while (retryCount < maxRetries) {
//         try {
//           await page.goto(link, {
//             waitUntil: ["networkidle0", "domcontentloaded"],
//             timeout: 50000,
//           });

//           if (timeoutReached) break;

//           // Use autoScroll on the scholar page
//           await autoScroll(page);

//           // Wait for the page to load
//           await page.waitForSelector(".page-title-box h4", { timeout: 50000 });

//           // Step 2.1: Extract Lecturer Name
//           const lecturerName = await page.evaluate(() => {
//             const nameElement = document.querySelector(".page-title-box h4");
//             return nameElement ? nameElement.textContent.trim() : "N/A";
//           });

//           console.log(`Lecturer Name: ${lecturerName}`);

//           // Step 2.2: Extract Research Group Data
//           const researchGroup = await page.evaluate(() => {
//             const sidebarMenu = document.querySelector("#sidebar-menu");
//             if (!sidebarMenu) return "N/A";

//             const researchGroupElement = sidebarMenu.querySelector(
//               "a[href*='research-groups'] span"
//             );
//             if (researchGroupElement) {
//               return researchGroupElement.innerText.trim().replace("\n", " ");
//             }

//             return "N/A";
//           });

//           console.log(`Research Group for ${link}: ${researchGroup}`);

//           // Step 2.3: Navigate to Intellectual Property Tab
//           await page.evaluate(() => {
//             const ipTab = document.querySelector('a[href="#ip_tab"]');
//             if (ipTab) ipTab.click();
//           });

//           // Wait for the Intellectual Property tab to load
//           await page.waitForSelector("#ip_tab #IPListTablePersonalDatatable", {
//             timeout: 50000,
//           });

//           // Step 2.4: Extract Intellectual Property Data
//           const intellectualPropertyData = await page.evaluate(() => {
//             const tableBody = document.querySelector(
//               "#IPListTablePersonalDatatable tbody"
//             );
//             if (!tableBody) return null;

//             const rows = Array.from(tableBody.querySelectorAll("tr"));
//             const ipFiledCount = rows.length;

//             const data = rows.map((row) => {
//               const cells = Array.from(row.querySelectorAll("td"));
//               return {
//                 ipName: cells[0]?.textContent.trim() || "N/A",
//                 ipLevel: cells[1]?.textContent.trim() || "N/A",
//                 ipCategory: cells[2]?.textContent.trim() || "N/A",
//               };
//             });

//             return { ipFiledCount, data };
//           });

//           console.log(
//             `Intellectual Property Data for ${link}:`,
//             intellectualPropertyData
//           );

//           // Save the data into the database
//           const scholarData = {
//             link: link,
//             name: lecturerName,
//             researchGroup: researchGroup,
//             ipFiled: intellectualPropertyData.ipFiledCount,
//             intellectualProperties: intellectualPropertyData.data,
//           };

//           await Scholar.replaceOne({ link }, scholarData, { upsert: true });
//           console.log(`Data saved for ${link}`);
//           break; // Exit retry loop if successful
//         } catch (error) {
//           retryCount++;
//           console.error(`Retry ${retryCount} for ${link}`);
//           if (retryCount === maxRetries) {
//             console.error(`Failed after ${maxRetries} attempts:`, error);
//           }
//         }
//       }
//     }

//     console.log("Scraping process completed.");
//   } catch (error) {
//     console.error("An error occurred during scraping:", error);
//   } finally {
//     clearTimeout(timeout); // Clear timeout
//     if (browser) await browser.close();
//     console.log("Browser closed.");
//   }
// }

// // AutoScroll function
// async function autoScroll(page) {
//   await page.evaluate(async () => {
//     const distance = 100;
//     let totalHeight = 0;
//     const delay = 100;

//     while (totalHeight < document.body.scrollHeight) {
//       window.scrollBy(0, distance);
//       totalHeight += distance;
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   });
// }

// module.exports = IPscrapeUTMScholar;

const puppeteer = require("puppeteer");
const Scholar = require("./Model/ipModel");

async function IPscrapeUTMScholar() {
  let browser;
  let timeout;
  const scrapedData = []; // Temporary in-memory storage for scraped data

  try {
    console.log("Starting scraping process for Intellectual Property...");

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    let allScholarLinks = [];
    let timeoutReached = false;

    timeout = setTimeout(() => {
      timeoutReached = true;
      console.log("Timeout reached: Stopping the scraping process.");
    }, 10 * 60 * 1000);

    console.log("Navigating to the faculty page...");
    await page.goto("https://utmscholar.utm.my/faculties/28", {
      waitUntil: "networkidle2",
    });

    let pageNumber = 1;

    while (!timeoutReached) {
      console.log(`Extracting scholar links from page ${pageNumber}...`);

      await autoScroll(page);

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
        console.log("Retrying next button click...");
      }

      pageNumber++;
    }

    console.log(`Total scholar links collected: ${allScholarLinks.length}`);

    for (const link of allScholarLinks) {
      if (timeoutReached) break;

      console.log(`Navigating to scholar page: ${link}`);

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await page.goto(link, {
            waitUntil: ["networkidle0", "domcontentloaded"],
            timeout: 50000,
          });

          if (timeoutReached) break;

          // Use autoScroll on the scholar page
          await autoScroll(page);

          // Wait for the page to load
          await page.waitForSelector(".page-title-box h4", { timeout: 50000 });

          // Step 2.1: Extract Lecturer Name
          const lecturerName = await page.evaluate(() => {
            const nameElement = document.querySelector(".page-title-box h4");
            return nameElement ? nameElement.textContent.trim() : "N/A";
          });

          console.log(`Lecturer Name: ${lecturerName}`);

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

          // Step 2.3: Navigate to Intellectual Property Tab
          await page.evaluate(() => {
            const ipTab = document.querySelector('a[href="#ip_tab"]');
            if (ipTab) ipTab.click();
          });

          // Wait for the Intellectual Property tab to load
          await page.waitForSelector("#ip_tab #IPListTablePersonalDatatable", {
            timeout: 50000,
          });

          // Step 2.4: Extract Intellectual Property Data
          const intellectualPropertyData = await page.evaluate(() => {
            const tableBody = document.querySelector(
              "#IPListTablePersonalDatatable tbody"
            );
            if (!tableBody) return null;

            const rows = Array.from(tableBody.querySelectorAll("tr"));
            const ipFiledCount = rows.length;

            const data = rows.map((row) => {
              const cells = Array.from(row.querySelectorAll("td"));
              return {
                ipName: cells[0]?.textContent.trim() || "N/A",
                ipLevel: cells[1]?.textContent.trim() || "N/A",
                ipCategory: cells[2]?.textContent.trim() || "N/A",
              };
            });

            return { ipFiledCount, data };
          });

          console.log(
            `Intellectual Property Data for ${link}:`,
            intellectualPropertyData
          );

          // Store the scraped data in memory
          scrapedData.push({
            link: link,
            name: lecturerName,
            researchGroup: researchGroup,
            ipFiled: intellectualPropertyData.ipFiledCount,
            intellectualProperties: intellectualPropertyData.data,
          });

          console.log(`Data for ${link} added to memory.`);
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

    // Step 3: Save all scraped data to the database after successful scraping
    if (scrapedData.length > 0) {
      await Scholar.insertMany(scrapedData);
      console.log("All data saved to the database successfully!");
    }
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  } finally {
    clearTimeout(timeout); // Clear timeout
    if (browser) await browser.close();
    console.log("Browser closed.");
  }
}

// AutoScroll function
async function autoScroll(page) {
  await page.evaluate(async () => {
    const distance = 100;
    let totalHeight = 0;
    const delay = 100;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, distance);
      totalHeight += distance;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
}

module.exports = IPscrapeUTMScholar;
