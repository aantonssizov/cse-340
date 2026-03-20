const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", {
    title: "Home",
    nav,
  });
};

baseController.buildTestServerError = async function (req, res) {
  const nav = await utilities.getNav();
  //unknown-view file does not exist
  res.render("unknown-view", { title: "Title", nav });
};

module.exports = baseController;
