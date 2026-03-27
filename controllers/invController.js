const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addClassificationResult =
    await invModel.addClassification(classification_name);
  if (addClassificationResult) {
    req.flash(
      "notice",
      `New classification ${classification_name} was successfully added`,
    );
    res.redirect(303, "/inv");
  } else {
    req.flash("notice", "Sorry, adding classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const addInventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );
  if (addInventoryResult) {
    req.flash(
      "notice",
      `New inventory ${inv_make} ${inv_model} was successfully added`,
    );
    res.redirect(303, "/inv");
  } else {
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, adding inventory failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
    });
  }
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  const nav = await utilities.getNav();
  const grid = await utilities.buildInventoryDetail(data);
  const title = `${data.inv_make} ${data.inv_model} Details`;
  res.render("inventory/detail", {
    title,
    nav,
    grid,
  });
};

module.exports = invCont;
