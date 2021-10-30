const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const { comparePasswords } = require("./repositories/users");

const app = express();
app.use(express.static("public")); // every request will come through here, express will look in public folder
// when we use the app.use, express will know to use bodyParser on all forms
// we will use the app.use whenever we want to wire up middleware inside our app
app.use(bodyParser.urlencoded({ extended: true })); // bodyParser only cares about urlencoded POST requests--we need help with type="file"
app.use(
  cookieSession({
    keys: ["gibberishwhatever"],
  })
);

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

// app is an object that describes all the things our web server can do
// we will customize app throught the project
// at the command line we type npm run dev which tells npm that we want to run the dev script in our package.json
// in this case it executes nodemon.js
// express is a library that helps us set up a full feature server

app.listen(3000, () => {
  console.log("Listening on 3000!");
});
