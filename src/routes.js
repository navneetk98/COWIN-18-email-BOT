const express = require("express");
const cowbot = require("./api/cowinbot/route");

module.exports = (app) => {
app.use("/api", cowbot());
};