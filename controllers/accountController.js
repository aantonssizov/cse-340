const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const accountController = {};
require("dotenv").config();

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
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(501).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

/* ****************************************
 *  Process Login
 * *************************************** */
accountController.logout = async function (req, res, next) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.locals.accountData = null;

  res.redirect("/");
};

/* ****************************************
 *  Deliver management view
 * *************************************** */
accountController.buildAccount = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Deliver update view
 * *************************************** */
accountController.buildUpdate = async function (req, res, next) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const account = await accountModel.getAccount(account_id);
  res.render("account/update", {
    title: `Update ${account.account_firstname}`,
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account.account_id,
    account_type: account.account_type,
  });
};

/* ****************************************
 *  Process Update
 * *************************************** */
accountController.update = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you're updated ${account_firstname}.`,
    );
    if (res.locals.accountData.account_id === account_id) {
      const accountData = updateResult.rows[0];
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
    }
    res.redirect("/account/");
  } else {
    const account = await accountModel.getAccount(account_id);
    req.flash("notice", "Sorry, the updating failed.");
    res.status(501).render("account/update", {
      title: `Update ${account_firstname}`,
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type: account.account_type,
    });
  }
};

/* ****************************************
 *  Process Change Type
 * *************************************** */
accountController.changeType = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_type, account_id } = req.body;
  const updateResult = await accountModel.changeType(account_id, account_type);

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you're changed the account type of ${updateResult.rows[0].account_firstname}.`,
    );
    if (res.locals.accountData.account_id === account_id) {
      const accountData = updateResult.rows[0];
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600 * 1000,
        },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
    }
    res.redirect("/account/");
  } else {
    const account = await accountModel.getAccount(account_id);
    req.flash("notice", "Sorry, the change of type failed.");
    res.status(501).render("account/update", {
      title: `Update ${account.account_firstname}`,
      nav,
      errors: null,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_id,
      account_type,
    });
  }
};

/* ****************************************
 *  Process Change Password
 * *************************************** */
accountController.changePassword = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the change of password.",
    );
    res.redirect(`/account/update/${account_id}`);
  }

  const updateResult = await accountModel.changePassword(
    account_id,
    hashedPassword,
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you're updated ${updateResult.rows[0].account_firstname}.`,
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the change of password failed.");
    res.redirect(`/account/update/${account_id}`);
  }
};

accountController.searchJSON = async function (req, res) {
  const { account_email } = req.params;
  const account = await accountModel.getAccountByEmail(account_email);
  if (account) {
    res.json({ account_id: account.account_id });
  } else {
    res.json("No matching account found.");
  }
};

module.exports = accountController;
