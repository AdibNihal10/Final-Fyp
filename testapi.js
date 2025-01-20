const fetch = require("node-fetch"); // Install via `npm install node-fetch`

async function testLogin() {
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "example@gmail.com", password: "1234admin" }),
  });

  const data = await response.json();
  console.log(data);
}

testLogin().catch((err) => console.error("Error:", err));
