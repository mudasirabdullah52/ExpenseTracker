const path = require('path');
const Expense = require('../Models/expensesModel');
const User = require('../Models/userModel');
const sequelize = require('../dbConnection');

exports.getExpenseMainHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "mainDashboard.html"));
};

exports.getExpenseMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Views', "expenseMain.html"));
};

exports.postExpenses = async (req, res) => {

    const { amount, description, category } = req.body;
    // console.log(req.user.id);
    // console.log(req.body, "expense controller")
    try {
        await Expense.create({
            expenseamount: amount,
            description: description,
            category: category,
            UserId: req.user.id
        })
        const totalExpense = parseInt(req.user.totalExpense) + parseInt(amount);
        // console.log(totalExpense, "my expesnses ");
        await User.update({ totalExpense: totalExpense }, { where: { id: req.user.id } })
        res.status(201).json({ message: 'success' });

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: 'exist' });
        } else {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


};
exports.getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const rowId = req.params.id;
        const rowdata = await Expense.findOne({ where: { id: rowId } })
        const deletedRows = await Expense.destroy({ where: { id: rowId } });
        const totalExpense = parseInt(req.user.totalExpense) - parseInt(rowdata.expenseamount)
        await User.update({ totalExpense: totalExpense }, { where: { id: req.user.id } })

        if (deletedRows === 0) {
            return res.status(404).send('Expense not found');
        }

        res.send('Expense deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

