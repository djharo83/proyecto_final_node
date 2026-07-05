const db = require('../config/db');

// =================================================================
// FUNCIONES HELPER PRIVADAS (No se exportan, solo se usan aquí)
// Para que en el buscador se pueda filtrar por categoría, precio y estado del artículo
// =================================================================

const buildFiltersQuery = (filters) => {
    let filterQuery = '';
    const filterParams = [];

    if (filters.category_id) {
        filterQuery += ` AND a.category_id = ?`;
        filterParams.push(filters.category_id);
    }
    if (filters.min_price) {
        filterQuery += ` AND a.price >= ?`;
        filterParams.push(filters.min_price);
    }
    if (filters.max_price) {
        filterQuery += ` AND a.price <= ?`;
        filterParams.push(filters.max_price);
    }
    if (filters.condition) {
        filterQuery += ` AND a.\`condition\` = ?`; 
        filterParams.push(filters.condition);
    }
    if (filters.search) {
        filterQuery += ` AND (a.title LIKE ? OR a.description LIKE ?)`;
        filterParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.filterStatus) {
        filterQuery += ` AND a.status = ?`;
        filterParams.push(filters.filterStatus);
    }
    if (filters.user_id) {
        filterQuery += ` AND a.user_id = ?`;
        filterParams.push(filters.user_id);
    }

    return { filterQuery, filterParams };
};

// =================================================================
// MÉTODOS DEL MODELO EXPORTADOS
// =================================================================
// 1. Obtener todos los artículos (Con paginación y filtros)
const getAll = async (page = 1, pageSize = 10, filters = {}) => {
    const offset = (page - 1) * pageSize;
    
    // 1. Llamamos a nuestra función Helper para que nos monte los filtros
    const { filterQuery, filterParams } = buildFiltersQuery(filters);
    
    // 2. Construimos la consulta base inyectando los filtros
    let query = `
        SELECT a.*, p.url as main_photo 
        FROM articles a 
        LEFT JOIN article_photos p ON a.id = p.article_id AND p.\`order\` = 0
        WHERE a.status = 'Publicado'
        ${filterQuery} 
        ORDER BY a.created_at DESC 
        LIMIT ? OFFSET ?
    `;

    // 3. Juntamos los parámetros de los filtros con los de la paginación
    const finalParams = [...filterParams, Number(pageSize), Number(offset)];

    // 4. Ejecutamos
    const [result] = await db.query(query, finalParams);
    return result;
};

// 2. Obtener un artículo por ID con sus fotos
const getById = async (id) => {
    const [articleRows] = await db.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (articleRows.length === 0) return null;

    const [photoRows] = await db.query('SELECT * FROM article_photos WHERE article_id = ? ORDER BY `order` ASC', [id]);
    
    const article = articleRows[0];
    article.photos = photoRows; 
    
    return article;
};


// 3. Función para traer todos los articulos de un usuario específico (con paginación)
const getByUserId = async (page = 1, pageSize = 10, userId) => {
    const offset = (page - 1) * pageSize;
    
    let query = `
        SELECT a.*, p.url as main_photo 
        FROM articles a 
        LEFT JOIN article_photos p ON a.id = p.article_id AND p.\`order\` = 0
        WHERE a.user_id = ?
        ORDER BY a.created_at DESC 
        LIMIT ? OFFSET ?
    `;

    const [result] = await db.query(query, [Number(userId), Number(pageSize), Number(offset)]);
    return result;
};

// 4. Crear artículo secuencialmente (Estilo clase)
const create = async (articleData, photoUrls) => {
    const { user_id, category_id, title, description, price, condition, location } = articleData;

    // A. Insertamos el artículo de manera sencilla
    const [articleResult] = await db.query(
        `INSERT INTO articles (user_id, category_id, title, description, price, \`condition\`, status, location) 
         VALUES (?, ?, ?, ?, ?, ?, 'Publicado', ?)`,
        [user_id, category_id, title, description, price, condition, location]
    );
    
    const articleId = articleResult.insertId;

    // B. Si el controlador nos pasa URLs de fotos, las guardamos una a una
    if (photoUrls && photoUrls.length > 0) {
        for (let i = 0; i < photoUrls.length; i++) {
            await db.query(
                "INSERT INTO article_photos (article_id, url, `order`) VALUES (?, ?, ?)",
                [articleId, photoUrls[i], i]
            );
        }
    }

    return articleId;
};


// 5. Modificar los datos generales de un artículo y devolverlo actualizado
const updateById = async (id, articleData) => {
    const { title, description, price, condition, location, category_id, status } = articleData;
    
    // Obtenemos el artículo actual para saber su estado en caso de que no venga uno nuevo en el PUT
    const articuloActual = await getById(id);
    if (!articuloActual) return null;

    const finalStatus = status || articuloActual.status;

    // Hacemos la actualización limpia de datos generales + estado
    await db.query(
        `UPDATE articles 
         SET title = ?, description = ?, price = ?, \`condition\` = ?, location = ?, category_id = ?, status = ?
         WHERE id = ?`,
        [title, description, price, condition, location, category_id, finalStatus, id]
    );
    
    // Retornamos el artículo actualizado
    return await getById(id);
};

// 6. Cambiar únicamente el estado y devolver el artículo actualizado
const updateStatus = async (id, newStatus) => {

    // Actualizamos únicamente el status nuevo, sin tocar previous_status
    await db.query(
        "UPDATE articles SET status = ? WHERE id = ?",
        [newStatus, id]
    );
    
    // Retornamos el artículo ya actualizado
    return await getById(id);
};


// 7. Eliminar artículo y sus fotos asociadas
const deleteById = async (id) => {
    // A. Borramos las fotos asociadas de la tabla secundaria
    await db.query("DELETE FROM article_photos WHERE article_id = ?", [id]);

    // B. Borramos el registro del artículo de la tabla principal
    const [result] = await db.query("DELETE FROM articles WHERE id = ?", [id]);

    return result.affectedRows > 0;
};

// 8.Consulta para favoritos
const existsArticleById = async(id) => {

    const [rows] = await db.query("SELECT EXISTS(SELECT 1 FROM articles WHERE id = ?) AS existe", [id]);

    return Boolean(rows[0].existe);

}

// 9.Usuarios/Moderador
const updateReportArticleStatus = async (connection, {article_id, new_status, new_previous_status}) => {
    const query = `
        UPDATE articles 
        SET status = ?, 
            previous_status = ? 
        WHERE id = ?`;

    const [result] = await connection.query(query, [new_status, new_previous_status, article_id]);
    return result;
};

// 10. Obtener la información de un artículo por su ID
const getArticleInfo = async(connection, article_id) => {
    const [result] = await connection.query("SELECT ar.status, ar.user_id FROM articles ar WHERE ar.id = ?", [article_id]);
    return result[0] ? result[0] : null;
}

module.exports = { getAll, getById, getByUserId,updateById, updateStatus, create, deleteById, existsArticleById, updateReportArticleStatus, getArticleInfo };
    