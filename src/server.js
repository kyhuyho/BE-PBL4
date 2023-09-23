import express from "express";
import bodyParser from "body-parser"; // lay dc cac tham so phia client su dung  query  ex : /user?id=7
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connect from "./config/connectDB";
import cors from "cors";
const fileUpload = require("express-fileupload");
require("dotenv").config();

let app = express();
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//khai bao row
viewEngine(app);
initWebRoutes(app);

connect();

let port = process.env.PORT || 8080;
//port  == undefine => port = 6969
app.listen(port, () => {
  console.log("BE Nodejs is running on  the port :" + port);
});
