const express = require("express");
const router = express.Router();

const messageStore = require("../data/messagesStore.js");

router.get("/", (req, res) => {
  res.render("index", { messages: messageStore.getMessages() });
});

router.get("/messages", (req, res) => {
  res.json(messageStore.getMessages());
});

router.post("/newMessage", (req, res) => {
  messageStore.addMessage(req.body);
  res.json(messageStore.getMessages());
});

module.exports = router;
