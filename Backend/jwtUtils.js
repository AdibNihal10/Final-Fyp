// const jwt = require("jsonwebtoken");
// const { secretKey } = require("../jwtConfig");

// function generateToken(user) {
//     const payload = {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         isAdmin: user.isAdmin,
//         starredGrants: user.starredGrants
//     }
//     return jwt.sign(payload, secretKey, { expiresIn: "1h" });
// }

// module.exports = {
//     generateToken
// };

const jwt = require("jsonwebtoken");
const { secretKey } = require("../jwtConfig");
const User = require("./Model/Users"); // Adjust path to your User model as necessary

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare plain text password (DO NOT USE IN PRODUCTION)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

module.exports = {
  login,
  generateToken,
};
