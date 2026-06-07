const categories = require("../models/categories.model");
const { StatusCodes } = require("http-status-codes");

const get = async (req, res, next) => {
  
  const { id } = req.params;

  if (!id)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "ID requerido" });

  try {
    
    const category = await categories.selectById(id);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Categoría no encontrada" });
    }

    return res.status(StatusCodes.OK).json({ category });

  } catch (error) {
    next(error);
  }
};


const getAll = async (req, res, next) => {
  
  try {
    
    const categoriesList = await categories.selectAll();
    
    return res.status(StatusCodes.OK).json({ categories: categoriesList });
  
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  
  try {
    
    const result = await categories.insert(req.body);

    const insertId = result.insertId || result.insert_id || null;

    if (!insertId) {
      return res.status(StatusCodes.CREATED).json({ message: "Categoría creada (sin id devuelto)", result: result });
    }

    const category = await categories.selectById(insertId);
    
    return res.status(StatusCodes.CREATED).json({ message: "Categoría creada exitosamente", category });
  
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  
  const { id } = req.params;
  
  const { name, slug } = req.body;
  
  try {
    
    const category = await categories.selectById(id);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Categoría no encontrada" });
    }

    await categories.update(id, { name, slug });
    
    const categoryActualizada = await categories.selectById(id);
    
    return res.status(StatusCodes.OK).json({message: "Categoría actualizada exitosamente", category: categoryActualizada});
  
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  
  const { id } = req.params;
  
  try {
    
    const category = await categories.selectById(id);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Categoría no encontrada" });
    }

    await categories.deleteById(id);
      
    return res.status(StatusCodes.OK).json({ message: "Categoría eliminada exitosamente", category: category });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove
};
