const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./modules/user");

// 連線資料庫
mongoose
  .connect("mongodb://localhost/potato-chatroom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
  });

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/register", function (req, res) {
  const { username, password } = req.body;

  // Check if the account is already registered in the User database
  User.findOne({ username })
    .then((user) => {
      // If the account has been registered, return an error message
      if (user) {
        return res.status(400).json({
          message: "Account has already been registered",
        });
      }

      // If the account has not been registered, create a new account with encrypted password
      const newUser = new User({
        username,
        password: bcrypt.hashSync(password, 10),
      });

      newUser.save().then((user) => {
        res.json(user);
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// create a login route
app.post("/login", function (req, res) {
  const { username, password } = req.body;

  // Check if the account is already registered in the User database
  User.findOne({ username })
    .then((user) => {
      // If the account has not been registered, return an error message
      if (!user) {
        return res.status(400).json({
          message: "Account has not been registered",
        });
      }

      // If the account has been registered, compare the password with the encrypted password
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({
          message: "Wrong password",
        });
      }

      // If the password is correct, return the user data
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

app.get("/", function (req, res) {
  res.send("Hello World!!!!!!!!");
});

// 啟動伺服器
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
