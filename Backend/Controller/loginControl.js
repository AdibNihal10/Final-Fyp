const Scholar = require("../Model/Users"); // Assuming the user model is Scholar

const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Get email and password from request

    // Check if the user exists in the database
    const user = await Scholar.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // If user not found
    }

    // Compare provided password with the stored password
    // Since we are not using bcrypt, assuming passwords are stored in plaintext
    if (user.password !== password) {
      // Simple password comparison (plaintext)
      return res.status(401).json({ message: "Invalid credentials" }); // Invalid password
    }

    // If login is successful, return a response with user data (you may want to add a token here)
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, name: user.name }, // Customize the data you want to return
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { login };
