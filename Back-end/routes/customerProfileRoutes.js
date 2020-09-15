"use strict";

const express = require("express");
const Router = express.Router();
const signup = require("../customer/customerProfile");

Router.post("/signup", async (req, res) => {
  console.log("Signup if unique email, otherwise return email already exist");
  let results = null;
  results = await signup(req.body, res);
  return results;
});

module.exports = Router;
