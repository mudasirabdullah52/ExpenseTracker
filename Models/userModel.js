const Sequelize = require("sequelize");
const sequelize = require("../dbConnection");

let userDb = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phoneNo: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        unique: true
    }
    ,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isPremium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    totalExpense: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    // totalIncome: {
    //     type: Sequelize.DECIMAL,
    //     allowNull: false,
    //     defaultValue: 0
    // },
    // Savings: {
    //     type: Sequelize.DECIMAL,
    //     allowNull: false,
    //     defaultValue: 0
    // }
})
module.exports = userDb;