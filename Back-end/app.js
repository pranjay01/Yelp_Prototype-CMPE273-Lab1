"use strict";

const express = require("express");
const bodyParser = require("body-parser");
// const mysqlConnection = require("./mysqlConnection");
const bizProfile = require("./routes/bizProfile");
// const customerRoutes = require("./routes/cus");

var app = express();

app.use(bodyParser.json());

app.use("/biz", bizProfile);

app.listen(3000);
