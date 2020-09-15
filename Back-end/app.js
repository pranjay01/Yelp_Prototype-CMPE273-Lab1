"use strict";

const express = require("express");
const bodyParser = require("body-parser");
// const mysqlConnection = require("./mysqlConnection");
const bizProfile = require("./routes/bizProfileRoutes");
const custProfile = require("./routes/customerProfileRoutes");
// const customerRoutes = require("./routes/cus");

var app = express();

app.use(bodyParser.json());

app.use("/biz", bizProfile);
app.use("/customer", custProfile);

app.listen(3000);
