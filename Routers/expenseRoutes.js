const express = require('express');
const authnticateUser = require('../Middleware/auth');
const moneyController = require('../Controllers/moneyController');


const expenseRoutes = express.Router();
expenseRoutes.get('/mainDashboard', moneyController.getExpenseMainHomePage);
expenseRoutes.get('/expenseMain', moneyController.getExpenseMainPage);

expenseRoutes.post('/create', authnticateUser.authenticate, moneyController.postExpenses);
expenseRoutes.get('/read', authnticateUser.authenticate, moneyController.getExpense);
expenseRoutes.delete('/delete/:id', authnticateUser.authenticate, moneyController.deleteExpense);


module.exports = expenseRoutes;