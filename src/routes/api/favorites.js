const router = require("express").Router();

const favoritesController = require("../../controllers/favorites.controller");

/**
 * @openapi
 * /api/favorites/{id}:
 *   get:
 *     summary: Obtiene un favorito por su ID
 *     description: Retorna los detalles de un favorito específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la favorito a buscar
 *     responses:
 *       200:
 *         description: Favorito encontrado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Tecnología"
 *     tags:
 *       - Favoritos
 */
router.get("/:id", favoritesController.get);
router.get("/", favoritesController.getAll);
router.post("/", favoritesController.create);
router.delete("/:id", favoritesController.remove);

module.exports = router;