// We're going to move many route handlers from index.js to here for organizational purposes
const express = require("express");
const usersRepo = require("../../repositories/users");

// we will create a sub-router and export it
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(`
          <div>
            Your id is: ${req.session.userId}
              <form method="POST">
                  <input name="email" placeholder="email"/>
                  <input name="password" placeholder="password"/>
                  <input name="passwordConfirmation" placeholder="password confirmation"/>
                  <button>Sign Up!</button>
              </form>
          </div>
      `);
});

// and now we need to actually make use of the middleware we created
router.post("/signup", async (req, res) => {
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
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(`
    <div>
    
      <form method="POST">
          <input name="email" placeholder="email"/>
          <input name="password" placeholder="password"/>
          
          <button>Sign In</button>
      </form>
  </div>
    `);
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
