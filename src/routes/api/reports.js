const router = require('express').Router();
const { getAll, create } = require('../../controllers/reports.controller');
const { checkToken, checkRole } = require('../../middlewares/auth.middleware');

// Rutas de /api/reports
router.get('/', checkToken, checkRole(['Moderador', 'Administrador']), getAll);
router.post('/', checkToken, create);

module.exports = router;