const pool = require("./pool.js");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log("seeding...");

  await pool.query(SQL);

  await pool.end();

  console.log("done");
}

main().catch(console.error);
