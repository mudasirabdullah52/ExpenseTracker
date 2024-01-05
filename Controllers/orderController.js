const Razorpay = require('razorpay');
const Order = require('../Models/orderModel')
// const User = require('../Models/userModel')
const userController = require('./usersController')


exports.purchasepremium = async (req, res) => {
    console.log(process.env.RAZORPAY_KEY_ID)
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err })
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } }) //2
        // const user = await User.findOne({ where: { id: userId } })
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
        const promise2 = req.user.update({ isPremium: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ sucess: true, message: "Transaction Successful" });
        }).catch((error) => {
            throw new Error(error)
        })



    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

