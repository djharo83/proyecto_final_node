const db = require('../config/db');

const selectAll = async () => {
  const [result] = await db.query("SELECT * FROM categories");
  return result;
};

const insert = async ({ name, slug }) => {
  const [result] = await db.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug],
  );
  return result;
};

const update = async (id, { name, slug }) => {
  const [result] = await db.query(
    "UPDATE categories SET name = ?, slug = ? WHERE id = ?",
    [name, slug, id],
  );
  return result;
};

const deleteById = async (id) => {
  const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
  return result;
};

const selectById = async (id) => {
  const [result] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
  return result[0] || null;
};

module.exports = { selectAll, insert, selectById, update, deleteById };