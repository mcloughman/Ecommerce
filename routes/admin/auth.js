// We're going to move many route handlers from index.js to here for organizational purposes
const express = require("express");
const { check } = require("express-validator"); // destructure to avoid using dot notation
const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");
// we will create a sub-router and export it
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

// and now we need to actually make use of the middleware we created
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),

  async (req, res) => {
    const { email, password } = req.body;
    // key and value same for email so no need for email: email

    // Create a user in our usersRepo to rejpresent this person
    // Store the id of the user inside the users cookie
    // again key and val for email and password equal
    const user = await usersRepo.create({ email, password });

    // req.session is added by cookie-session it's given as an empty object to which we can add whatever we want
    // we don't have to name the property userId!
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

module.exports = router;
