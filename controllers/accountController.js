const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Deliver signup view
 * *************************************** */
accountController.buildSignup = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/signup", {
    title: "Signup",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Signup
 * *************************************** */
accountController.signupAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  const signupResult = await accountModel.signupAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  );

  if (signupResult) {
    req.flash(
      "notice",
      `Congratulations, you're signed up ${account_firstname}. Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registratioin failed.");
    res.status(501).render("account/signup", {
      title: "Signup",
      nav,
    });
  }
};

module.exports = accountController;
