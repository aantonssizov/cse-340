const utilities = require(".");
const { body, validationResult, check } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.signupRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to signup
 * ***************************** */
validate.checkSignupData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/signup", {
      errors,
      title: "Signup",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and should already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (!emailExists) {
          throw new Error(
            "Email does not exist. Please sign up or use different email",
          );
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Search Data Validation Rules
 * ********************************* */
validate.searchRules = () => {
  return [
    // valid email is required and should already exist in the DB
    check("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (!emailExists) {
          throw new Error("Email does not exist. Please use a different email");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to search
 * ***************************** */
validate.checkSearchData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json(errors);
    return;
  }
  next();
};

/*  **********************************
 *  Update Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // id is required and should exist
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide id")
      .custom(async (account_id) => {
        const account = await accountModel.getAccount(account_id);
        if (!account) {
          throw new Error("Account does not exist");
        }
      }),

    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const originalAccount = await accountModel.getAccount(account_id);
        if (originalAccount.account_email !== account_email) {
          const emailExists =
            await accountModel.checkExistingEmail(account_email);
          if (emailExists) {
            throw new Error(
              "Email exists. Please log in or use different email",
            );
          }
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const account = await accountModel.getAccount(account_id);
    res.render("account/update", {
      errors,
      title: `Update ${account_firstname}`,
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type: account.account_type,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Change Type Data Validation Rules
 * ********************************* */
validate.changeTypeRules = () => {
  return [
    // id is required and should exist
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide id")
      .custom(async (account_id) => {
        const account = await accountModel.getAccount(account_id);
        if (!account) {
          throw new Error("Account does not exist");
        }
      }),

    // type is required and must be either Client, Employee or Admin
    body("account_type")
      .trim()
      .escape()
      .notEmpty()
      .isIn(["Client", "Employee", "Admin"])
      .withMessage("Please provide a type."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to change type
 * ***************************** */
validate.checkChangeTypeData = async (req, res, next) => {
  const { account_type, account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const account = await accountModel.getAccount(account_id);
    const nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: `Update ${account.account_firstname}`,
      nav,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type,
      account_id,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Change Password Data Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // id is required and should exist
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide id")
      .custom(async (account_id) => {
        const account = await accountModel.getAccount(account_id);
        if (!account) {
          throw new Error("Account does not exist");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to change password
 * ***************************** */
validate.checkChangePasswordData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const account = await accountModel.getAccount(account_id);
    res.render("account/update", {
      errors,
      title: `Update ${account.account_firstname}`,
      nav,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_lastname,
      account_type: account.account_type,
      account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
