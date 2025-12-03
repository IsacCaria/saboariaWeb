const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtosController');

router.get('/', controller.list);
router.get('/:id', controller.detail);

module.exports = router;
