const express = require('express');

const orderController = require('../Controllers/orderController');

const authnticateUser = require('../Middleware/auth');

const router = express.Router();

router.get('/premiummembership', authnticateUser.authenticate, orderController.purchasepremium);

router.post('/updatetransactionstatus', authnticateUser.authenticate, orderController.updateTransactionStatus)

module.exports = router;