const Sequelize = require("sequelize");

// const sequelize = new Sequelize('my-expense-tracker-db', 'root', 'Mudasir@1231', {
//     host: 'localhost',
//     dialect: 'mysql',

// });
const sequelize = new Sequelize('sql12676126', 'sql12676126', 'aNBSlu3dNY', {
    host: 'sql12.freemysqlhosting.net',
    dialect: 'mysql',

});
module.exports = sequelize;

