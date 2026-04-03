// Needed Resources
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const accountValidate = require("../utilities/account-validation");

// Route to build account view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount),
);

// Route to build login view
router.get("/login/", utilities.handleErrors(accountController.buildLogin));

// Route to build signup view
router.get("/signup/", utilities.handleErrors(accountController.buildSignup));

// Route to logout
router.get("/logout/", utilities.handleErrors(accountController.logout));

// Route to build update account view
router.get(
  "/update/:account_id/",
  utilities.handleErrors(accountController.buildUpdate),
);

// Route to update account
router.post(
  "/update/",
  accountValidate.updateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.update),
);

// Route to change account's password
router.post(
  "/change-password",
  accountValidate.changePasswordRules(),
  accountValidate.checkChangePasswordData,
  utilities.handleErrors(accountController.changePassword),
);

// Route to signup new account
router.post(
  "/signup/",
  accountValidate.signupRules(),
  accountValidate.checkSignupData,
  utilities.handleErrors(accountController.signupAccount),
);

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount),
);

module.exports = router;
