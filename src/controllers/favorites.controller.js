const TestModel = require("../models/favorites.model");

const checkDb = async (req, res) => {
  try {
    // Guardamos los datos que vienen del modelo
    const users = await TestModel.getAllUsers();

    res.json({
      status: "OK",
      message: "Datos recuperados con éxito",
      count: users.length, // Opcional: para saber cuántos hay
      data: users, // Datos recuperados de la base de datos
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Error al recuperar los datos",
      error: error.message,
    });
  }
};

module.exports = { checkDb };
