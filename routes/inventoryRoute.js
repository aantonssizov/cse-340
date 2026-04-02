// Needed Resources
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidation = require("../utilities/inventory-validation");

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification),
);

// Route to add new classification
router.post(
  "/add-classification",
  inventoryValidation.addClassificationRules(),
  inventoryValidation.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification),
);

// Route to build add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory),
);

// Route to add new inventory
router.post(
  "/add-inventory",
  inventoryValidation.addInventoryRules(),
  inventoryValidation.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory),
);

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
);

// Route to build inventory detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildInventoryDetail),
);

// Route to get inventory by classification id
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON),
);

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory),
);

// Route to edit an inventory
router.post(
  "/edit/",
  inventoryValidation.addInventoryRules(),
  inventoryValidation.checkEditInventoryData,
  utilities.handleErrors(invController.editInventory),
);

// Route to build delete an inventory view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventory),
);

// Route to delete an inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
