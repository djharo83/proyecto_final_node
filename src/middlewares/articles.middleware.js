const ArticlesModel = require('../models/articles.model');

const checkArticleId = async (req, res, next) => {
    const { id } = req.params;
    
    // 1. ¿Es un número válido?
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID del artículo debe ser un número válido' });
    }

    try {
        // 2. ¿Existe el artículo?
        const article = await ArticlesModel.getById(id); 
        if (!article) {
            return res.status(404).json({ message: 'No existe ningún artículo con ese ID' });
        }

        // 3. Guardamos el artículo en la Request para que 'isOwner' y los controladores no tengan que volver a buscarlo
        req.article = article;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { checkArticleId };