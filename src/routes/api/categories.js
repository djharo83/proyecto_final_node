const router = require("express").Router();

const categoriesController = require("../../controllers/categories.controller");

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     description: Retorna los detalles de una categoría específica basada en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a buscar
 *     responses:
 *       200:
 *         description: Categoría encontrada con éxito.
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
 *       - Categorías
 */
router.get("/:id", categoriesController.get);
router.get("/", categoriesController.getAll);
router.post("/", categoriesController.create);
router.put("/:id", categoriesController.update);
router.delete("/:id", categoriesController.remove);

module.exports = router;
