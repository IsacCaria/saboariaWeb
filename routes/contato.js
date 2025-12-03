const express = require('express');
const router = express.Router();
const controller = require('../controllers/contatoController');

router.get('/', controller.form);
router.post('/', controller.submit);

module.exports = router;
