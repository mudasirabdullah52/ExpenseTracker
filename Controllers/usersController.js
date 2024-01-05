const User = require('../Models/userModel');
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//Rendering Login page
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "login.html"));
};

//Rendering Registration page
exports.getRegistrationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', "Views", "register.html"));
};

exports.postRegistrationData = async (req, res) => {

    const { nameInput, phoneInput, emailInput, passwordInput } = req.body

    console.log(nameInput, phoneInput, emailInput, passwordInput, '"controlelr"');
    // const date = formatDate(moment().format('L'));

    try {
        const passWord = await bcrypt.hash(passwordInput, 10);
        await User.create({
            name: nameInput,
            phoneNo: phoneInput,
            email: emailInput,
            password: passWord
        });
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

const generateAccessToken = (id, name, isPremium) => {
    return jwt.sign({ userId: id, name: name, isPremium: isPremium }, 'secretkey');
}

exports.checkLogin = async (req, res) => {
    const body = req.body;

    const { email, password } = body;

    console.log(email, password);
    try {
        let data = await User.findOne({
            where: {
                email: email
            },

        });

        console.log(data.password);
        if (data) {
            const checkLogin = await bcrypt.compare(password, data.password);
            if (checkLogin) {
                res.status(201).json({ message: 'success', token: generateAccessToken(data.id, data.name, data.isPremium) });
                // res.status(201).json({ message: 'success' });
            } else {
                res.status(401).json({ message: 'Failed' });
            }
        } else {
            res.status(404).json({ message: 'NotExist' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
