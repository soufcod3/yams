const Pastry = require("../models/Pastry");
const pastries = require("../ressources/pastries.js");

async function insertPastriesInDb() {
  const pastriesInDb = await Pastry.find();

  if (pastriesInDb.length === 0) {
    pastries.forEach((pastry) => {
      const pastryToInsert = new Pastry({
        ...pastry,
      });
      pastryToInsert
        .save()
        .then(() => console.log("Pastry saved :", pastry.name));
    });
  }
}

module.exports = { insertPastriesInDb }