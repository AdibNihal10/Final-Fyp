const User = require("./Model/Users");

async function verifyAdmin(email, password) {
  try {
    // Find the user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User not found");
    }
    // Validate password
    if (existingUser.password !== password) {
      throw new Error("Incorrect password");
    }
    // Check if the user is an admin
    if (!existingUser.isAdmin) {
      throw new Error("Access denied: Not an admin");
    }
    return existingUser; // Return the user details if valid
  } catch (error) {
    console.error("Login error:", error.message);
    throw new Error("Invalid credentials");
  }
}

module.exports = { verifyAdmin };
