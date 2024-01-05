const express = require('express');
const router = express.Router();
const dataController = require('../Controllers/dataController');
router.get("/", dataController.getIndex);
module.exports = router;