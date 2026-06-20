const router = require('express').Router();
const { createUserReport, getReportsPendingArticles, getReportsPendingUsers } = require('../../controllers/reports.controller');
const { checkToken, checkRole } = require('../../middlewares/auth.middleware');

//Rutas de /api/reports

//Ruta para que el usurio cree un reporte
router.post('/', checkToken, createUserReport);

//Rutas Moderador
router.get('/pending/articles', checkToken, checkRole(['Moderador', 'Administrador']), getReportsPendingArticles);
router.get('/pending/users', checkToken, checkRole(['Moderador', 'Administrador']), getReportsPendingUsers);
router.get('/pending/articles/detail/:id', checkToken, checkRole(['Moderador', 'Administrador']), getReportPendingArticle);
router.get('/pending/users/detail/:id', checkToken, checkRole(['Moderador', 'Administrador']), getReportPendingUser);

module.exports = router;