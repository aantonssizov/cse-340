const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const validate = {};

/*  **********************************
 *  Add Classification Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification name is required and should contain any spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches("^[a-zA-Z]+$")
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const nameExists =
          await inventoryModel.checkExistingClassification(classification_name);
        if (nameExists)
          throw new Error(
            "Classification name exists. Please use a different name.",
          );
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Add Inventory Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // inventory make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory make."),

    // inventory model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory model."),

    // inventory year is required and should be number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please provide a inventory year."),

    // inventory description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory description."),

    // inventory image is required
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory image."),

    // inventory thumbnail is required
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory thumbnail."),

    // inventory price is required
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isCurrency({
        allow_decimal: true,
        allow_negatives: false,
        require_decimal: false,
        require_symbol: false,
      })
      .withMessage("Please provide a inventory price."),

    // inventory miles is required
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide a inventory miles."),

    // inventory color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a inventory color."),

    // classification should exist
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide a classification id.")
      .custom(async (classification_id) => {
        const classifiaction =
          await inventoryModel.getClassification(classification_id);
        if (!classifiaction) {
          throw new Error(
            "Classification does not exist. Please provide other classification id.",
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList =
      await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
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
    return;
  }
  next();
};

module.exports = validate;
