const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');

router.get('/', controller.dashboard);
router.get('/produtos', controller.produtos);
router.get('/pedidos', controller.pedidos);

module.exports = router;
