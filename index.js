const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { SALT } = process.env;
const cors = require("cors");
const verifyToken = require("./middlewares/auth.js");

/** Create connection to mongodb */
mongoose.connect("mongodb://127.0.0.1:27017/cryptopay", () => {
  console.log("connected to mongodb");
});

/** 
1. Unlike sequelize, there is no need to use ./models/index.js to create and export db 
2. Just import models here
*/
const User = require("./models/User.js");

/** Import controllers */
const UserController = require("./controllers/userCtrl");

/** Import routes */
const userRoutes = require("./routes/userRoutes.js");

/** Instantiate controllers and pass in models. I will include SALT later (for JWT verification) */
const userControl = new UserController(User, SALT);

/** Initialize express instance */
const app = express();
app.use(cors({ origin: true }));

/** Middlewares */
app.use(express.urlencoded({ extended: false })); // handles req.body from form requests
app.use(express.json()); // handles json from axios post requests

/** To access files stored in public folder */
app.use(express.static("public"));

/** Instantiate routes */
app.use("/", userRoutes(userControl, verifyToken));
/** Set app to listen on the selected PORT */
const PORT = process.env.PORT || 3008;
app.listen(PORT);
