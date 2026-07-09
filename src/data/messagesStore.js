const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    userId: crypto.randomUUID(),
    added: {
      time: "10:00",
      month: "Jan",
      year: 2026,
    },
  },
  {
    text: "Hello World!",
    user: "Charles",
    userId: crypto.randomUUID(),
    added: {
      time: "10:00",
      month: "Jan",
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
