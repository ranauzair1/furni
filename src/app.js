const env = process.env.NODE_ENV || "development";
env == "development" ? require("dotenv").config() : "";
var express = require("express");
const sequelize = require("./config/db.config");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

var passport = require("passport");
const { getJwtStrategy } = require("./config/passport");
const globalErrorHandler = require("../src/middlewares/globalError");
const cookieSession = require("cookie-session");
var app = express();
app.use(cors("*"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(fileUpload());
app.use(morgan("dev"));
const router = express.Router();
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: "4mb" }));
const connectWithDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("===> Connection To Database Has Been Established");
  } catch (error) {
    console.log("There is some error in syncing models", error);
  }
};
connectWithDB();
const routes = require("./routes/");
app.use("/api/v1/", routes(router));
app.get("/test", (req, res) => {
  res.status(200).send("Welcome to backend");
});
app.post("/testform", (req, res) => {
  console.log("req.body", req.body);
  console.log("req.form", req.form);
  res.status(200).send("Welcome to backend");
});
passport.use(getJwtStrategy());

app.use(globalErrorHandler);

module.exports = app;
