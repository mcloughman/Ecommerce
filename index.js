const express = require("express");
const bodyParser = require("body-parser");
const repo = require("./users");

const app = express();
// when we use the app.use, express will know to use bodyParser on all forms
// we wil use the app.use whenever we want to wire up middleware inside our app
app.use(bodyParser.urlencoded({ extended: true }));

// app is an object that describes all the things our web server can do
// we will customize app throught the project
// at the command line we type npm run dev which tells npm that we want to run the dev script in our package.json
// in this case it executes nodemon.js
// express is a library that helps us set up a full feature server

// anytime someone makes a request to the root route of our app, we want to run the callback
app.get("/", (req, res) => {
  res.send(`
        <div>
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
app.post("/", (req, res) => {
  console.log(req.body);
  res.send("<h1>Account Created</h1>");
});

app.listen(3000, () => {
  console.log("Listening on 3000!");
});
