const favorites = require("../models/favorites.model");
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
    
    const result = await favorites.insert(req.body);

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
