const Sequelize = require("sequelize");

const sequelize = new Sequelize('my-expense-tracker-db', 'root', 'Mudasir@1231', {
    host: 'localhost',
    dialect: 'mysql',

});


module.exports = sequelize;

