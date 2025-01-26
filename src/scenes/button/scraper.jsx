// import React from "react";

// const RunScraperButton = () => {
//   const handleButtonClick = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/start-scraping", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       alert(data.message); // Display success message
//     } catch (error) {
//       console.error("Error starting scraper:", error);
//       alert(
//         "Failed to start the scraping process. Check the console for details."
//       );
//     }
//   };

//   return (
//     <button
//       onClick={handleButtonClick}
//       style={{
//         padding: "10px 20px",
//         fontSize: "16px",
//         cursor: "pointer",
//         backgroundColor: "#4CAF50",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//       }}
//     >
//       Start Scraping
//     </button>
//   );
// };

// export default RunScraperButton;

import React from "react";

const RunScraperButton = () => {
  const handleButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/start-scraping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error starting scraper:", error);
      alert(
        "Failed to start the scraping process. Check the console for details."
      );
    }
  };
  const handleIPScrapingButtonClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/start-scraping-ip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error starting IP scraper:", error);
      alert(
        "Failed to start the IP scraping process. Check the console for details."
      );
    }
  };
  const handleRGScrapingButtonClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/start-scraping-rg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error starting RG scraper:", error);
      alert(
        "Failed to start the RG scraping process. Check the console for details."
      );
    }
  };
  const handlePubScrapingButtonClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/start-scraping-pub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Display success message
    } catch (error) {
      console.error("Error starting publication scraper:", error);
      alert(
        "Failed to start the publication scraping process. Check the console for details."
      );
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        margin: "20px",
        textAlign: "center",
        gap: "20px",
        backgroundColor: "#f5f5f5",
        border: "2px",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Extract Data
      </h1>

      <button
        onClick={handleButtonClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Start Grants data Scraping
      </button>
      <button
        onClick={handleIPScrapingButtonClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Start IP Scraping
      </button>
      <button
        onClick={handleRGScrapingButtonClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Start RG Scraping
      </button>
      <button
        onClick={handlePubScrapingButtonClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Start Journal Scraping
      </button>
    </div>
  );
};

export default RunScraperButton;
