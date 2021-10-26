const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();
// when we use the app.use, express will know to use bodyParser on all forms
// we will use the app.use whenever we want to wire up middleware inside our app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["gibberishwhatever"],
  })
);

// app is an object that describes all the things our web server can do
// we will customize app throught the project
// at the command line we type npm run dev which tells npm that we want to run the dev script in our package.json
// in this case it executes nodemon.js
// express is a library that helps us set up a full feature server

// anytime someone makes a request to the root route of our app, we want to run the callback
app.get("/signup", (req, res) => {
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
app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

app.get("/signin", (req, res) => {
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

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email: email });
  if (!user) {
    return res.send("Email not found");
  }
  if (user.password !== password) {
    return res.send("Invalid password!");
  }
  req.session.userId = user.id;
  res.send("You are signed in.");
});

app.listen(3000, () => {
  console.log("Listening on 3000!");
});
