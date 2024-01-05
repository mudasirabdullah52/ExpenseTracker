const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'secretkey');
        console.log('userID >>>> premium', user.userId, user.isPremium)
        User.findByPk(user.userId).then(user => {

            req.user = user;
            next();
        })

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
        // err
    }

}

module.exports = {
    authenticate
}
