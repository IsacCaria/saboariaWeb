const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

router.get('/', controller.index);
router.get('/sobre', controller.sobre);
router.get('/equipe', controller.equipe);
router.get('/faleconosco', controller.faleconosco);

module.exports = router;
