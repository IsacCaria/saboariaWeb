const db = require('./db');

exports.create = async ({ name, email, message }) => {
  const [res] = await db.query('INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())', [name, email, message]);
  return res.insertId;
};
