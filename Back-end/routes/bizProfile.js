"use strict";

const express = require("express");
const Router = express.Router();
// const mysqlConnection = require("../mysqlConnection");
const signup = require("../restaurnt/restaurant");

Router.post("/signup", async (req, res) => {
  console.log("Signup if unique email, otherwise return email already exist");
  let results = null;
  results = await signup(req.body, res);
  // return signup(req.body, res);
  return results;
});

module.exports = Router;
