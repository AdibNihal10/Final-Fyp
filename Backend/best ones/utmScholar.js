const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeFilteredScholars() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();
  let allScholarLinks = [];

  console.log("Navigating to UTM Scholar page...");
  await page.goto("https://utmscholar.utm.my/scholars", {
    waitUntil: "networkidle2",
  });

  // Step 1: Enter 'FAKULTI KOMPUTERAN' in the search field
  console.log("Searching for 'FAKULTI KOMPUTERAN'...");
  await page.waitForSelector("#ScholarList_filter input");
  await page.type("#ScholarList_filter input", "FAKULTI KOMPUTERAN", {
    delay: 100,
  });

  //   await page.waitForTimeout(2000); // Wait for filtering to complete

  let pageNumber = 1;

  // Step 2: Gather all links across all pages (pagination)
  while (true) {
    console.log(`Extracting scholar links from page ${pageNumber}...`);

    const scholarLinks = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#ScholarList tbody tr")
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

    // Check for the 'Next' button under #ScholarList_next
    const isNextButtonDisabled = await page.evaluate(() => {
      const nextButton = document.querySelector("li#ScholarList_next");
      return nextButton ? nextButton.classList.contains("disabled") : true;
    });

    if (isNextButtonDisabled) {
      console.log("Reached the last page, stopping pagination.");
      break;
    }

    console.log("Clicking the 'Next' button...");
    await page.evaluate(() => {
      document.querySelector("li#ScholarList_next a").click();
    });

    // await page.waitForTimeout(3000); // Wait for the next page to load
    pageNumber++;
  }

  console.log(`Total scholar links collected: ${allScholarLinks.length}`);

  // Step 3: Visit each scholar link to scrape data
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

          // Extract data
          const textWhiteDivs = Array.from(
            document.querySelectorAll(".text-white")
          );
          textWhiteDivs.forEach((div) => {
            const heading = div.querySelector("h6");
            const valueElement = div.querySelector("h2");

            if (heading && valueElement) {
              const headingText = heading.textContent.trim();
              const value = extractNumber(valueElement);
              dataObj[headingText] = value;
            }
          });

          const hIndexElement = document.querySelector("#hIndexID");
          if (hIndexElement)
            dataObj["H-INDEXED (SCOPUS)"] = extractNumber(hIndexElement);

          const citationsElement = document.querySelector(
            "#CountPublicIndexID"
          );
          if (citationsElement)
            dataObj["CITATIONS (SCOPUS)"] = extractNumber(citationsElement);

          return dataObj;
        });
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000 * retryCount));
        continue;
      }
    }

    if (scholarData && Object.keys(scholarData).length > 0) {
      console.log(`Data extracted from ${link}:`, scholarData);
      scrapedData.push({ link, ...scholarData });
    } else {
      console.error(
        `Failed to extract data from ${link} after ${retryCount} attempts.`
      );
      scrapedData.push({ link, error: "Failed to extract data" });
    }
  }

  console.log("All scholar data has been scraped.");

  // Step 4: Save data to a file
  const dataString = JSON.stringify(scrapedData, null, 2);
  fs.writeFileSync("filtered_scholar_data.txt", dataString, "utf8");
  console.log("Scraped data saved to filtered_scholar_data.txt");

  await browser.close();
}

scrapeFilteredScholars().catch(console.error);
