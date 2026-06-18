const router = require("express").Router();

const {checkToken} = require ('../../middlewares/auth.middleware')
const { favoritesSchema } = require('../../schemas/favorites.schema'); 
const { validateSchema } = require('../../middlewares/validation.middleware'); 

const favoritesController = require("../../controllers/favorites.controller");

router.get("/user", checkToken, favoritesController.getAllFavoritesUser);
router.get("/:id", favoritesController.get);
router.post("/", checkToken, validateSchema(favoritesSchema), favoritesController.create);
router.delete("/:id", checkToken, favoritesController.remove);

module.exports = router;