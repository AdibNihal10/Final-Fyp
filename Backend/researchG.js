// const puppeteer = require("puppeteer");
// const mongoose = require("mongoose");
// const Scholar = require("./Model/researchGroup"); // Import the MongoDB model

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

//   // Set a timeout to stop the process after 3 minutes
//   //   const timeout = setTimeout(() => {
//   //     timeoutReached = true;
//   //     console.log("Timeout reached: Stopping the scraping process.");
//   //   }, 3 * 60 * 1000); // 3 minutes in milliseconds

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
//       if (!nextButton) {
//         console.log("Next button not found, all pages processed.");
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

//           // Wait for key elements
//           await Promise.all([
//             page.waitForSelector("#sidebar-menu", { timeout: 1000 }),
//           ]);

//           // Scroll through the page
//           await autoScroll(page);

//           // Extract data from the scholar page
//           scholarData = await page.evaluate(() => {
//             const extractNumber = (element) => {
//               if (!element) return 0;
//               const text = element.textContent.trim();
//               const number = parseInt(text.replace(/\D/g, ""), 10);
//               return isNaN(number) ? 0 : number;
//             };

//             const dataObj = {};

//             // Extract data from text-white divs
//             const textWhiteDivs = Array.from(
//               document.querySelectorAll(".text-white")
//             );
//             textWhiteDivs.forEach((div) => {
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

//             // Extract Indexed, Non-Indexed Publications, and Grants
//             const inboxItems = Array.from(
//               document.querySelectorAll(".inbox-item")
//             );
//             inboxItems.forEach((item) => {
//               const titleElement = item.querySelector(".float-start");
//               const numberElement = item.querySelector(".float-end");

//               if (titleElement && numberElement) {
//                 const title = titleElement.textContent.trim();
//                 const value = extractNumber(numberElement);
//                 if (title && value !== undefined) {
//                   dataObj[title] = value;
//                 }
//               }
//             });

//             return dataObj;
//           });

//           // Extract Research Group Data
//           const researchGroup = await page.evaluate(() => {
//             const sidebarMenu = document.querySelector("#sidebar-menu");
//             if (!sidebarMenu) return null;

//             const researchGroupAnchor = sidebarMenu.querySelector(
//               "a[href*='research-groups'] span"
//             );
//             if (researchGroupAnchor) {
//               return researchGroupAnchor.innerText.trim().replace("\n", " ");
//             }

//             return "N/A";
//           });

//           console.log(`Research Group found: ${researchGroup || "None"}`);
//           scholarData["researchGroup"] = researchGroup;

//           // Ensure data types match the model schema
//           const preparedData = {
//             link: link,
//             GRANT_PI_MEMBERS: scholarData["GRANT(PI & MEMBERS)"] || 0,
//             PUBLICATIONS: scholarData["PUBLICATIONS"] || 0,
//             INDEXED_PUBLICATION: scholarData["INDEXED PUBLICATION"] || 0,
//             NON_INDEXED_PUBLICATION:
//               scholarData["NON-INDEXED PUBLICATION"] || 0,
//             OTHERS_PUBLICATION: scholarData["OTHERS PUBLICATION"] || 0,
//             TOTAL_STUDENTS: scholarData["TOTAL STUDENTS"] || 0,
//             MASTER: scholarData["MASTER"] || 0,
//             PHD: scholarData["PHD"] || 0,
//             H_INDEXED_SCOPUS: scholarData["H-INDEXED (SCOPUS)"] || 0,
//             CITATIONS_SCOPUS: scholarData["CITATIONS (SCOPUS)"] || 0,
//             UNIVERSITY_FUND: scholarData["UNIVERSITY FUND"] || 0,
//             NATIONAL_GRANTS: scholarData["NATIONAL GRANTS"] || 0,
//             INTERNATIONAL_GRANTS: scholarData["INTERNATIONAL GRANTS"] || 0,
//             INDUSTRY_GRANTS: scholarData["INDUSTRY GRANTS"] || 0,
//             TOTAL: scholarData["TOTAL"] || 0,
//             researchGroup: researchGroup,
//           };

//           if (scholarData && Object.keys(scholarData).length > 0) {
//             console.log(`Data extracted from ${link}:`, preparedData);
//             scrapedData.push(preparedData);

//             // Insert or update database
//             await Scholar.replaceOne({ link }, preparedData, { upsert: true });
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
//     // Close browser and database connection
//     await browser.close();
//     await mongoose.connection.close();
//     console.log("Browser and database connection closed.");
//   }
// }

// // AutoScroll function
// async function autoScroll(page) {
//   await page.evaluate(async () => {
//     const distance = 100;
//     let totalHeight = 0;
//     const scrollHeight = document.body.scrollHeight;

//     while (totalHeight < scrollHeight) {
//       window.scrollBy(0, distance);
//       totalHeight += distance;
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     }
//   });
// }

// scrapeUTMScholar().catch(console.error);

const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Scholar = require("./Model/researchGroup"); // Import the MongoDB model

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
  const scrapedData = []; // Store scraped data temporarily

  console.log("Navigating to the faculty page...");
  await page.goto("https://utmscholar.utm.my/faculties/28", {
    waitUntil: "networkidle2",
  });
  let timeoutReached = false;

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
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 1000 }),
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
      if (timeoutReached) break;

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

          // Wait for key elements
          await Promise.all([
            page.waitForSelector("#sidebar-menu", { timeout: 1000 }),
          ]);

          // Scroll through the page
          await autoScroll(page);

          // Extract Lecturer Name
          const lecturerName = await page.evaluate(() => {
            const pageTitleBox = document.querySelector(".page-title-box h4");
            return pageTitleBox ? pageTitleBox.textContent.trim() : "N/A";
          });

          console.log(`Lecturer Name: ${lecturerName}`);

          // Extract data from the scholar page
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

          // Extract Research Group Data
          const researchGroup = await page.evaluate(() => {
            const sidebarMenu = document.querySelector("#sidebar-menu");
            if (!sidebarMenu) return null;

            const researchGroupAnchor = sidebarMenu.querySelector(
              "a[href*='research-groups'] span"
            );
            if (researchGroupAnchor) {
              return researchGroupAnchor.innerText.trim().replace("\n", " ");
            }

            return "N/A";
          });

          console.log(`Research Group found: ${researchGroup || "None"}`);
          scholarData["researchGroup"] = researchGroup;

          // Ensure data types match the model schema
          const preparedData = {
            link: link,
            name: lecturerName,
            GRANT_PI_MEMBERS: scholarData["GRANT(PI & MEMBERS)"] || 0,
            PUBLICATIONS: scholarData["PUBLICATIONS"] || 0,
            INDEXED_PUBLICATION: scholarData["INDEXED PUBLICATION"] || 0,
            NON_INDEXED_PUBLICATION:
              scholarData["NON-INDEXED PUBLICATION"] || 0,
            OTHERS_PUBLICATION: scholarData["OTHERS PUBLICATION"] || 0,
            TOTAL_STUDENTS: scholarData["TOTAL STUDENTS"] || 0,
            MASTER: scholarData["MASTER"] || 0,
            PHD: scholarData["PHD"] || 0,
            H_INDEXED_SCOPUS: scholarData["H-INDEXED (SCOPUS)"] || 0,
            CITATIONS_SCOPUS: scholarData["CITATIONS (SCOPUS)"] || 0,
            UNIVERSITY_FUND: scholarData["UNIVERSITY FUND"] || 0,
            NATIONAL_GRANTS: scholarData["NATIONAL GRANTS"] || 0,
            INTERNATIONAL_GRANTS: scholarData["INTERNATIONAL GRANTS"] || 0,
            INDUSTRY_GRANTS: scholarData["INDUSTRY GRANTS"] || 0,
            TOTAL: scholarData["TOTAL"] || 0,
            researchGroup: researchGroup,
          };

          if (scholarData && Object.keys(scholarData).length > 0) {
            console.log(`Data extracted from ${link}:`, preparedData);
            scrapedData.push(preparedData);

            // Insert or update database
            await Scholar.replaceOne({ link }, preparedData, { upsert: true });
          } else {
            throw new Error("No meaningful data extracted");
          }
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
        }
      }
    }

    console.log("Scraping process completed.");
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  } finally {
    // Close browser and database connection
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
    const scrollHeight = document.body.scrollHeight;

    while (totalHeight < scrollHeight) {
      window.scrollBy(0, distance);
      totalHeight += distance;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
}

scrapeUTMScholar().catch(console.error);
