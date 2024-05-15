const mongoose = require("mongoose");
const pastrySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  image: { type: String, unique: true, required: true },
  stock: { type: Number, required: true },
  quantityWon: { type: Number, required: true },
});
module.exports = mongoose.model("Pastry", pastrySchema);
