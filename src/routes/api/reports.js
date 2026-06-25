const router = require('express').Router();
const { getAll, create } = require('../../controllers/reports.controller');
const { checkToken, checkRole } = require('../../middlewares/auth.middleware');
const { validateSchema } = require('../../middlewares/validation.middleware');
const { reportSchema } = require('../../schemas/reports.schema');

// Rutas de /api/reports
router.get('/',  checkToken, checkRole(['Moderador', 'Administrador']), getAll);
router.post('/', checkToken, validateSchema(reportSchema), create);

module.exports = router;