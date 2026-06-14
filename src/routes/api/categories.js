const router = require("express").Router();

const {checkToken, checkRole} = require ('../../middlewares/auth.middleware')
const { categoriesSchema } = require('../../schemas/categories.schema'); 
const { validateSchema } = require('../../middlewares/validation.middleware'); 

const categoriesController = require("../../controllers/categories.controller");

// RUTA PÚBLICA: Para la Landing Page u otras rutas públicas (Cualquiera puede ver las categorías)
router.get("/landing", categoriesController.getAll);
router.get("/", categoriesController.getAll);
router.get("/:id", categoriesController.get);

// RUTAS PRIVADAS: Solo para el Administrador (Gestión de categorías)
router.post("/", checkToken, checkRole(['Administrador']), validateSchema(categoriesSchema), categoriesController.create);
router.put("/:id", checkToken, checkRole(['Administrador']), validateSchema(categoriesSchema), categoriesController.update);
router.delete("/:id", checkToken, checkRole(['Administrador']),categoriesController.remove);
module.exports = router;
