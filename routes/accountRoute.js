// Needed Resources
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const signupValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login/", utilities.handleErrors(accountController.buildLogin));

// Route to build signup view
router.get("/signup/", utilities.handleErrors(accountController.buildSignup));

// Route to signup new account
router.post(
  "/signup/",
  signupValidate.signupRules(),
  signupValidate.checkSignupData,
  utilities.handleErrors(accountController.signupAccount),
);

module.exports = router;
