const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query("SELECT * FROM favorites");
  return result;
};

const insert = async ({ user_id, article_id }) => {
  const [result] = await db.query(
    "INSERT INTO favorites (user_id, article_id) VALUES (?, ?)",
    [user_id, article_id],
  );
  return result;
};

const deleteById = async (id) => {
  const [result] = await db.query("DELETE FROM favorites WHERE id = ?", [id]);
  return result;
};

const selectById = async (id) => {
  const [result] = await db.query("SELECT * FROM favorites WHERE id = ?", [id]);
  return result[0] || null;
};

module.exports = { selectAll, insert, selectById, deleteById };