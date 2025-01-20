const UserModel = require("../../Model/Users"); // Adjust path as needed

module.exports = (app) => {
  // Login route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user in the database
      const user = await UserModel.findOne({ email });

      if (!user || user.password !== password) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      if (!user.isAdmin) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied: Admins only" });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Add more routes if needed (e.g., logout, register, etc.)
};
