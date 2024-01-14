const path = require('path');
const Expense = require('../Models/expensesModel');
const User = require('../Models/userModel');
const sequelize = require('../dbConnection');
const PDFDocument = require('pdfkit');
// const exceljs = require('exceljs');
const xlsx = require('xlsx');
const fs = require('fs');

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
    const limit = +req.query.rows || 5;
    let totalItems;
    try {
        const page = +req.query.page || 1;
        const id = req.user.id;
        totalItems = await Expense.count({ where: { UserId: id } });
        const result = await Expense.findAll({ where: { UserId: id }, offset: (page - 1) * limit, limit: limit });
        res.status(200).json({
            result,
            currentPage: page,
            hasNextPage: limit * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / limit)
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
    }
    // try {
    //     const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
    //     res.json(expenses);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Internal Server Error');
    // }
}

exports.downloadUserData = async (req, res) => {
    try {
        const result = await Expense.findAll({ where: { UserId: req.user.id } });
        // let response = result[0];
        // console.log(result)
        // let response = [
        //     { id: 1, name: 'John Doe', email: 'john@example.com' },
        //     { id: 2, name: 'Jane Smith', email: 'jane@example.com' },

        // ];

        const response = JSON.parse(JSON.stringify(result));
        // // const response = result.map(expense => [expense.expenseamount, expense.category, expense.description]);
        var date = new Date().toJSON();
        let text = req.user.name + date
        text = text.replaceAll(":", '-');
        text = text.replaceAll(".", '-');

        console.log(text)

        let workbook = xlsx.utils.book_new()
        let worksheet = xlsx.utils.json_to_sheet(response);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Exp');
        xlsx.writeFile(workbook, `C:\\Users\\hp\\Desktop\\ExpenseData\\${text}.xlsx`);
        res.status(201).json({ message: 'success' });
        // console.log(response)



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

