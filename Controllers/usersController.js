const User = require('../Models/userModel');
const forgetPasswordModel = require('../Models/forgetPasswordModel');
const path = require('path');
// var SibApiV3Sdk = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const sgMail = require('@sendgrid/mail');
const { env } = require('process');
const nodemailer = require('nodemailer');

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

exports.SendforgetPasswordLink = async (req, res) => {
    // const apiKey = 'xsmtpsib-10ea09bf079968a53d6ba28224f5e970f1704358b75a66d3dbe7a971e3b129ee-gaqsyNSCW9PfD45U';
    try {
        const email = req.body.emailId;
        console.log(email);
        const id = uuidv4();
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log(user.id)
            await forgetPasswordModel.create({
                id: id,
                UserId: user.id
            });
            // sending froget password link to user 

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mudasirabdullah773@gmail.com',
                    pass: process.env.EMAILPASSWORD
                },
            });

            // Email options
            const mailOptions = {
                from: 'mudasirabdullah773@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: 'Text content of your email',
                html: `<p><b>Hi ${user.name}</b> </br> You have got the reset password request from 
                you if you want to rest the password please click on the given link </br>
                <a href="http://localhost:3000/user/forgetPassword/${id}">click</a>  </p> `,
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    res.status(202).json({ message: 'success' });
                    console.log('Email sent:', info.response);
                }
            });
        } else {
            res.status(404).json({ message: 'User Not Found Check email address!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    // console.log(process.env.EMAILPASSWORD)
};
exports.getForgetPasswordPage = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await forgetPasswordModel.findOne({ where: { id: id, isactive: 1 } });
        if (response) {
            // const t = await sequelize.transaction();
            try {
                // await response.update({ isactive: 0 }, { transaction: t });
                await response.update({ isactive: 0 });
                // await t.commit();
                res.sendFile(path.join(__dirname, '..', "Views", "forgetPasswordPage.html"));
            } catch (error) {
                // await t.rollback();
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            res.status(404).json({ message: 'Url Not Exist Check Url' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updatePasswordData = async (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    // const date = formatDate(new Date().toLocaleDateString());
    // const t = await sequelize.transaction();
    try {
        const response = await forgetPasswordModel.findOne({ where: { id: id } });
        const userId = response.UserId;
        const passWordHashed = await bcrypt.hash(password, 10);
        await User.update({ passWord: passWordHashed }, { where: { id: userId } });
        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
