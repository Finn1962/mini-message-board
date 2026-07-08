const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: {
      time: "12:49 AM",
      month: "JUL",
      year: "2024",
    },
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: {
      time: "12:49 AM",
      month: "JUL",
      year: "2024",
    },
  },
];

function getMessages() {
  return messages;
}

function addMessage(message) {
  messages.push(message);
}

module.exports = {
  getMessages,
  addMessage,
};
