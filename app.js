// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./Routers/routes');
const path = require('path');
const userRoute = require('./Routers/userRoutes');
const sequelize = require('./dbConnection');
const expenseRoutes = require('./Routers/expenseRoutes');
const orderRoutes = require('./Routers/orderRoutes');
const premiumRoutes = require('./Routers/premiumRoutes');
const User = require('./Models/userModel')
const Expense = require('./Models/expensesModel')
const Order = require('./Models/orderModel')

// const public = require('./Views/js')



const app = express();
const port = 3000;
const dotenv = require('dotenv');
// get config vars
dotenv.config();

// app.use(express.static('Views'));
app.use(express.static(path.join(__dirname, 'Views')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// app.use(express.static('Views'));
app.use("/user", userRoute);
app.use('/expense', expenseRoutes)
app.use('/order', orderRoutes)
app.use('/premium', premiumRoutes)
app.use(router);

// Creating referential integrity
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync({ force: false })
    .then(() => {
        // Start the server after syncing models
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Error syncing models:', err));

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

