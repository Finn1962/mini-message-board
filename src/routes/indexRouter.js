const express = require("express");
const path = require("path");
const router = express.Router();

const messageStore = require("../data/messagesStore.js");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/messages", (req, res) => {
  res.json(messageStore.getMessages(req.query.numberOfMessages));
});

router.post("/newMessage", (req, res) => {
  messageStore.addMessage(req.body);
  res.json(messageStore.getMessages(req.query.numberOfMessages));
});

module.exports = router;
