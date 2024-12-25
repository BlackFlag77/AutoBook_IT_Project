// Temporary User Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
//   followers: {
//     type: Array,
//     default: [],
//   },
//   followings: {
//     type: Array,
//     default: [],
//   },
}, { timestamps: true });

//text index on user for searching capabilities
// postSchema.index({ username: "text" });

module.exports = mongoose.model(
  "UserModel",
  userSchema
);
