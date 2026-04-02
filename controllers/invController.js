const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
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
 *  Process Edit Inventory
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const {
    inv_id,
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
  const editInventoryResult = await invModel.editInventory(
    inv_id,
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
  if (editInventoryResult) {
    req.flash(
      "notice",
      `The inventory ${inv_make} ${inv_model} was successfully edited`,
    );
    res.redirect("/inv/");
  } else {
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, editing inventory failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
      errors: null,
      inv_id,
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
    });
  }
};

/* ***************************
 *  Process Delete Inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  const deleteInventoryResult = await invModel.deleteInventory(inv_id);
  if (deleteInventoryResult) {
    req.flash(
      "notice",
      `The inventory ${inv_make} ${inv_model} was successfully deleted`,
    );
    res.redirect("/inv/");
  } else {
    const nav = await utilities.getNav();
    req.flash("notice", "Sorry, deleting inventory failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: `Delete ${inv_make} ${inv_model}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
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
  let className;
  if (data[0]) {
    className = data[0].classification_name;
  } else {
    const classification = await invModel.getClassification(classification_id);
    className = classification.classification_name;
  }
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    errors: null,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Builld edit inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const inventory = await invModel.getInventoryById(inv_id);
  let name = `${inventory.inv_make} ${inventory.inv_model}`;
  const classificationList = await utilities.buildClassificationList(
    inventory.classification_id,
  );
  res.render("inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    classificationList,
    errors: null,
    inv_id: inventory.inv_id,
    inv_make: inventory.inv_make,
    inv_model: inventory.inv_model,
    inv_year: inventory.inv_year,
    inv_description: inventory.inv_description,
    inv_image: inventory.inv_image,
    inv_thumbnail: inventory.inv_thumbnail,
    inv_price: inventory.inv_price,
    inv_miles: inventory.inv_miles,
    inv_color: inventory.inv_color,
    classification_id: inventory.classification_id,
  });
};

/* ***************************
 *  Builld delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) => {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const inventory = await invModel.getInventoryById(inv_id);
  let name = `${inventory.inv_make} ${inventory.inv_model}`;
  res.render("inventory/delete-confirm", {
    title: "Delete " + name,
    nav,
    errors: null,
    inv_id: inventory.inv_id,
    inv_make: inventory.inv_make,
    inv_model: inventory.inv_model,
    inv_year: inventory.inv_year,
    inv_price: inventory.inv_price,
  });
};

module.exports = invCont;
