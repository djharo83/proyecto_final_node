const favorites = require("../models/favorites.model");
const articles = require("../models/articles.model");
const { StatusCodes } = require("http-status-codes");

const get = async (req, res, next) => {

  const { id } = req.params;

  if (!id)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "ID requerido" });

  try {
    
    const favorite = await favorites.selectById(id);

    if (!favorite) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Favorite no encontrado" });
    }

    return res.status(StatusCodes.OK).json({favorite});

  } catch (error) {
    next(error);
  }
};

const getAllFavoritesUser = async (req, res, next) => {
  
  const { id : userId } = req.user;

  try {
    
    const favoritesUser = await favorites.selectFavoritesUser(userId);
    
    return res.status(StatusCodes.OK).json({ results: favoritesUser });
  
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  
  try {
    
    //Comprobar si el artículo existe
    const { user_id, article_id } = req.body;
    const existsArticle = await articles.existsArticleById(article_id);

    if (!existsArticle) {
      return res.status(StatusCodes.NOT_FOUND)
        .json({ message: "El artículo que intentas guardar en favoritos no existe." });
    }

    //comprobar si el favorito ya existe en la tabla
    const favoriteExists = await favorites.getFavoriteByUserIdAndArtcleId(user_id, article_id);

    if(favoriteExists){
      return res.status(StatusCodes.BAD_REQUEST)
        .json({message: "Este artículo ya está en tu lista de favoritos."});
    }

    const result = await favorites.insert(user_id, article_id);

    const insertId = result.insertId || result.insert_id || null;

    if (!insertId) {
      return res.status(StatusCodes.CREATED).json({ message: "Favorite creado (sin id devuelto)", result: result });
    }

    const favorite = await favorites.selectById(insertId);
    
    return res.status(StatusCodes.CREATED).json({ message: "Favorite creado exitosamente", favorite });
  
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  
  const { id } = req.params;
  
  try {
    
    const favorite = await favorites.selectById(id);

    if (!favorite) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Favorite no encontrado" });
    }

    await favorites.deleteById(id);
      
    return res.status(StatusCodes.OK).json({ message: "Favorite eliminado exitosamente", favorite: favorite });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getAllFavoritesUser,
  create,
  remove
};
