const express = require("express");
const path = require("path");
const router = express.Router();
const querys = require("../db/queries.js");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../assets/index.html"));
});

router.get("/messages", async (req, res) => {
  res.json(await querys.getAllMessages());
});

router.post("/newMessage", async (req, res) => {
  await querys.insertMessage(req.body);
  res.json(await querys.getAllMessages());
});

module.exports = router;
