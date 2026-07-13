const pool = require("./pool.js");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function insertMessage(message) {
  await pool.query(
    "INSERT INTO messages (text, user_name, user_id) VALUES ($1, $2, $3)",
    [message.text, message.user_name, message.user_id],
  );
}

module.exports = {
  getAllMessages,
  insertMessage,
};
