// const puppeteer = require("puppeteer");
// const mongoose = require("mongoose");
// const Scholar = require("./scholarModel"); // Import the MongoDB model

// async function scrapeUTMScholar() {
//   // Connect to MongoDB
//   await mongoose.connect("mongodb://127.0.0.1:27017/utm_scholars");
//   console.log("Connected to MongoDB");

//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: false,
//     userDataDir: "./tmp",
//   });
//   const page = await browser.newPage();
//   let allScholarLinks = [];
//   const scrapedData = []; // Store scraped data temporarily

//   console.log("Navigating to the faculty page...");
//   await page.goto("https://utmscholar.utm.my/faculties/28", {
//     waitUntil: "networkidle2",
//   });

//   let timeoutReached = false;

//   // Set a timeout to stop the process after 5 minutes
//   const timeout = setTimeout(() => {
//     timeoutReached = true;
//   }, 5 * 60 * 1000); // 5 minutes in milliseconds

//   let pageNumber = 1;

//   try {
//     // Step 1: Gather all links across all pages (pagination)
//     while (!timeoutReached) {
//       console.log(`Extracting scholar links from page ${pageNumber}...`);

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
//         console.log("Stopping pagination due to timeout or no next button.");
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
//           page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }),
//         ]);
//       } catch (navError) {
//         console.error("Navigation error:", navError);
//         console.log("Retrying next button click...");
//       }

//       pageNumber++;
//     }

//     console.log(`Total scholar links collected: ${allScholarLinks.length}`);

//     // Step 2: Visit each scholar link to scrape data
//     for (const link of allScholarLinks) {
//       if (timeoutReached) break;

//       console.log(`Navigating to scholar page: ${link}`);

//       let retryCount = 0;
//       let scholarData = null;

//       while (
//         retryCount < 3 &&
//         (!scholarData || Object.keys(scholarData).length === 0)
//       ) {
//         try {
//           await page.goto(link, {
//             waitUntil: ["networkidle0", "domcontentloaded"],
//             timeout: 30000,
//           });

//           console.log("Extracting data from scholar page...");

//           scholarData = await page.evaluate(() => {
//             const extractNumber = (element) => {
//               if (!element) return 0;
//               const text = element.textContent.trim();
//               if (!text) return 0;
//               const number = parseInt(text.replace(/\D/g, ""), 10);
//               return isNaN(number) ? 0 : number;
//             };

//             const dataObj = {};

//             const textWhiteDivs = Array.from(
//               document.querySelectorAll(".text-white")
//             );
//             textWhiteDivs.forEach((div) => {
//               if (!div) return;

//               const heading = div.querySelector("h6");
//               const valueElement = div.querySelector("h2");

//               if (heading && valueElement) {
//                 const headingText = heading.textContent.trim();
//                 const value = extractNumber(valueElement);
//                 if (headingText && value !== undefined) {
//                   dataObj[headingText] = value;
//                 }
//               }
//             });

//             const hIndexElement = document.querySelector("#hIndexID");
//             if (hIndexElement) {
//               dataObj["H-INDEXED (SCOPUS)"] = extractNumber(hIndexElement);
//             }

//             const citationsElement = document.querySelector(
//               "#CountPublicIndexID"
//             );
//             if (citationsElement) {
//               dataObj["CITATIONS (SCOPUS)"] = extractNumber(citationsElement);
//             }

//             return dataObj;
//           });

//           if (scholarData && Object.keys(scholarData).length > 0) {
//             console.log(`Data extracted from ${link}:`, scholarData);

//             // Debugging: Log the data being inserted
//             console.log("Data being inserted:", {
//               link,
//               GRANT_PI_MEMBERS: scholarData["GRANT(PI & MEMBERS)"],
//               PUBLICATIONS: scholarData["PUBLICATIONS"],
//               INDEXED_PUBLICATION: scholarData["INDEXED PUBLICATION"],
//               TOTAL_STUDENTS: scholarData["TOTAL STUDENTS"],
//               H_INDEXED_SCOPUS: scholarData["H-INDEXED (SCOPUS)"],
//               CITATIONS_SCOPUS: scholarData["CITATIONS (SCOPUS)"],
//             });

//             // Step 3: Replace existing document or insert if not found
//             await Scholar.replaceOne(
//               { link }, // Find document by link
//               {
//                 link,
//                 GRANT_PI_MEMBERS: scholarData["GRANT(PI & MEMBERS)"],
//                 PUBLICATIONS: scholarData["PUBLICATIONS"],
//                 INDEXED_PUBLICATION: scholarData["INDEXED PUBLICATION"],
//                 TOTAL_STUDENTS: scholarData["TOTAL STUDENTS"],
//                 H_INDEXED_SCOPUS: scholarData["H-INDEXED (SCOPUS)"],
//                 CITATIONS_SCOPUS: scholarData["CITATIONS (SCOPUS)"],
//               },
//               { upsert: true } // Insert if document doesn't exist
//             );
//             console.log(`Data replaced/inserted for ${link}`);
//           } else {
//             throw new Error("No meaningful data extracted");
//           }
//         } catch (error) {
//           console.error(`Attempt ${retryCount + 1} failed:`, error);
//           retryCount++;
//         }
//       }
//     }

//     console.log("Scraping process completed.");
//   } catch (error) {
//     console.error("An error occurred during scraping:", error);
//   } finally {
//     // Clean up
//     clearTimeout(timeout); // Clear the timeout
//     await browser.close();
//     await mongoose.connection.close();
//     console.log("Browser and database connection closed.");
//   }
// }

// scrapeUTMScholar().catch(console.error);
const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeUTMScholar() {
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
        page.click("#ListScholarFacultyDashboard_next"),
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
  const scrapedData = [];

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
            const number = parseInt(text.replace(/\D/g, ""), 10);
            return isNaN(number) ? 0 : number;
          };

          const dataObj = {};

          // Extract data from text-white divs
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

          // Extract H-Index
          const hIndexElement = document.querySelector("#hIndexID");
          if (hIndexElement) {
            dataObj["H-INDEXED (SCOPUS)"] = extractNumber(hIndexElement);
          }

          // Extract Citations
          const citationsElement = document.querySelector(
            "#CountPublicIndexID"
          );
          if (citationsElement) {
            dataObj["CITATIONS (SCOPUS)"] = extractNumber(citationsElement);
          }

          // Extract Indexed, Non-Indexed Publications, and Grants
          const inboxItems = Array.from(
            document.querySelectorAll(".inbox-item")
          );
          inboxItems.forEach((item) => {
            const titleElement = item.querySelector(".float-start");
            const numberElement = item.querySelector(".float-end");

            if (titleElement && numberElement) {
              const title = titleElement.textContent.trim();
              const value = extractNumber(numberElement);
              if (title && value !== undefined) {
                dataObj[title] = value;
              }
            }
          });

          return dataObj;
        });

        if (scholarData && Object.keys(scholarData).length > 0) {
          console.log(`Data extracted from ${link}:`, scholarData);
          scrapedData.push({
            link,
            ...scholarData,
          });
        } else {
          throw new Error("No meaningful data extracted");
        }
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        if (retryCount < 3) {
          console.log(`Retrying... (${retryCount}/3)`);
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * retryCount)
          );
        }
      }
    }
  }

  console.log("All scholar data has been scraped.");

  // Step 3: Write the scraped data to a .txt file
  const dataString = JSON.stringify(scrapedData, null, 2);
  fs.writeFileSync("scraped_scholar_data.txt", dataString, "utf8");

  console.log("Scraped data saved to scraped_scholar_data.txt");

  await browser.close();
}

scrapeUTMScholar().catch(console.error);
