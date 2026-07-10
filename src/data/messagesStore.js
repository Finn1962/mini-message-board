const messages = [
  {
    text: "Hello, this is my mini message board. If you like it, please follow me on GitHub. Have fun with it.",
    user: "Finn Schmidt",
    userId: crypto.randomUUID(),
    added: {
      time: "10:53",
      month: "Jul",
      year: 2026,
    },
  },
];

function getMessages(number) {
  return messages.slice(-number);
}

function addMessage(message) {
  messages.push(message);
}

module.exports = {
  getMessages,
  addMessage,
};
