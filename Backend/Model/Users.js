const mongoose = require("mongoose");
// This is a comment
const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
});

const UserModel = mongoose.model("users", UsersSchema, "users");
module.exports = UserModel;
