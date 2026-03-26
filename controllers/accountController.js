const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
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

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the signup.");
    res.status(500).render("account/signup", {
      title: "Signup",
      nav,
      errors: null,
    });
  }

  const signupResult = await accountModel.signupAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
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

/* ****************************************
 *  Process Login
 * *************************************** */
accountController.loginAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const loginResult = await accountModel.loginAccount(
    account_email,
    account_password,
  );

  if (loginResult) {
    req.flash(
      "notice",
      `Congratulations, you're logged in ${loginResult.rows[0]?.account_firstname ?? account_email}.`,
    );
    res.redirect(303, "/");
  } else {
    req.flash("notice", "Sorry, the login failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    });
  }
};

module.exports = accountController;
