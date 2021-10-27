// We're going to move many route handlers from index.js to here for organizational purposes
const express = require("express");
const { check, validationResult } = require("express-validator"); // destructure to avoid using dot notation
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

// we will create a sub-router and export it
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req: req }));
});

// and now we need to actually make use of the middleware we created
router.post(
  "/signup",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 4, max: 20 }),
    check("passwordConfirmation").trim().isLength({ min: 4, max: 20 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password, passwordConfirmation } = req.body;
    // key and value same for email so no need for email: email
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
      return res.send("Email in use");
    }
    if (password !== passwordConfirmation) {
      return res.send("Passwords must match");
    }
    // Create a user in our usersRepo to rejpresent this person
    // Store the id of the user inside the users cookie
    // again key and val for email and password equal
    const user = await usersRepo.create({ email, password });

    // req.session is added by cookie-session it's given as an empty object to which we can add whatever we want
    // we don't have to name the property userId!
    req.session.userId = user.id;
    res.send("<h1>Account Created</h1>");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email: email });
  if (!user) {
    return res.send("Email not found");
  }
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid Password");
  }
  req.session.userId = user.id;
  res.send("You are signed in.");
});

module.exports = router;
