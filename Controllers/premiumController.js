const path = require('path');
const User = require('../Models/userModel');
const Expense = require('../Models/expensesModel');
const sequelize = require('../dbConnection');
//Rendering home page
exports.getLeaderBoard = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', 'leaderBoard.html'));
}

exports.getLeaderBoardData = async (req, res) => {
    try {
        // const leaderboardofusers = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group: ['user.id'],
        //     order: [['total_cost', 'DESC']]

        // })
        const leaderboardofusers = await User.findAll({ order: [['totalExpense', 'DESC']] })
        res.status(200).json(leaderboardofusers)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

