const router = require('express').Router();

const { createReport,
        getReportsPendingArticles,
        getReportsPendingUsers,
        getReportPendingArticle, 
        getReportPendingUser,
        updateReportPendingArticle,
        getReportsHistory } = require('../../controllers/reports.controller');

        const { checkToken, checkRole } = require('../../middlewares/auth.middleware');

//Rutas de /api/reports

//Ruta para que el usurio cree un reporte
router.post('/', checkToken, createReport);

//Rutas Moderador
router.get('/pending/articles', checkToken, checkRole(['Moderador', 'Administrador']), getReportsPendingArticles);
router.get('/pending/users', checkToken, checkRole(['Moderador', 'Administrador']), getReportsPendingUsers);
router.get('/pending/article/detail/:id', checkToken, checkRole(['Moderador', 'Administrador']), getReportPendingArticle);
router.get('/pending/user/detail/:id', checkToken, checkRole(['Moderador', 'Administrador']), getReportPendingUser);
router.put('/pending/update/article/:id', checkToken, checkRole(['Moderador', 'Administrador']), updateReportPendingArticle);
router.get('/history', checkToken, checkRole(['Moderador', 'Administrador']), getReportsHistory);

module.exports = router;