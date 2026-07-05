const db = require('../config/db');

const selectFavoritesUser = async (user_id) => {
  const [result] = await db.query(`SELECT 
    fv.id AS favoriteId,
    fv.user_id AS favoriteUserId, 
    fv.article_id AS favoriteArticleId,
    ar.id AS articleId,
    ar.user_id AS ownerArticleId,
    ar.title, 
    ar.price, 
    ar.condition, 
    ar.status,
    ar.location,
    JSON_OBJECT(
                'id', ca.id,
                'name', ca.name,
                'slug', ca.slug
            ) AS category,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', arp.id,
            'url', arp.url,
            'order', arp.order
        )
    ) AS photos
FROM favorites fv  
INNER JOIN articles ar ON fv.article_id = ar.id
INNER JOIN categories ca ON ar.category_id = ca.id  
LEFT JOIN article_photos arp ON ar.id = arp.article_id
WHERE fv.user_id = ?
GROUP BY ar.id, fv.user_id, fv.article_id, ca.id`, [user_id]);
 
// En caso de que la consulta devuelva strings JSON, los convertimos en objetos/arrays reales de JS
  return result.map(row => ({
    ...row,// Mantenemos todas las propiedades originales y nos evitamos tener que escribirlas una a una userIdFavorito: row.userIdFavorito,...
    category: typeof row.category === 'string' ? JSON.parse(row.category) : row.category,
    photos: typeof row.photos === 'string' ? JSON.parse(row.photos) : row.photos
  }));  

};

const insert = async (user_id, article_id) => {
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

const getFavoriteByUserIdAndArtcleId = async(user_id, article_id) => {
  const [result] = await db.query("SELECT * FROM favorites WHERE user_id = ? and article_id = ?", [user_id, article_id]);
  return result[0] || null;
};

module.exports = { selectFavoritesUser, insert, selectById, deleteById, getFavoriteByUserIdAndArtcleId };