const express = require('express');
const userRoute = express.Router();
const userController = require('../Controllers/usersController');
userRoute.get("/login", userController.getLoginPage);
userRoute.get('/register', userController.getRegistrationPage);
userRoute.post('/addUser', userController.postRegistrationData);
userRoute.post('/check-login', userController.checkLogin);
module.exports = userRoute;