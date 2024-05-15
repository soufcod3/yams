const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  mail: { type: String, unique: true },
  username: { type: String, unique: false, required: true },
  password: { type: String, required: true },
  throwsLeft: { type: Number, required: true, default: 3 },
  pastries: { type: Array, required: true, default: [] }
});
module.exports = mongoose.model("User", userSchema);
