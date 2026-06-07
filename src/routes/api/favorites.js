const router = require("express").Router();

const favoritesController = require("../../controllers/favorites.controller");

router.get("/:id", favoritesController.get);
router.get("/", favoritesController.getAll);
router.post("/", favoritesController.create);
router.delete("/:id", favoritesController.remove);

module.exports = router;