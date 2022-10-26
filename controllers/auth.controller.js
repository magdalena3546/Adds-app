const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const getImageFileType = require('../utils/getImageFileType');

exports.register = async (req, res) => {
    const {
        login,
        password,
        phone
    } = req.body;

    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
    try {

        if (req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {

            const userWithLogin = await User.findOne({
                login
            });
            if (userWithLogin) {
                return res.status(409).send({
                    message: 'User with this login already exists'
                });
            }
            const user = await new User({
                login,
                password: await bcrypt.hash(password, 10),
                avatar: req.file.filename,
                phone
            });
            await user.save();
            res.json({
                message: 'User created ' + user.login
            });
        } else {
            res.status(400).send({
                message: 'bad request'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const {
            login,
            password,
            avatar,
            phone
        } = req.body;
        if (login && typeof login === 'string' && password && typeof password === 'string') {
            const user = await User.findOne({
                login
            });
            if (!user) {
                res.status(400).send({
                    message: 'Login or password are incorrect'
                });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.login = user.login;
                    res.status(200).send({
                        message: req.session
                    });
                } else {
                    res.status(400).send({
                        message: 'Login or password are incorrect'
                    });
                }
            }
        } else {
            res.status(400).send({
                message: 'Bad request'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.getUser = async (req, res) => {
    res.send({
        message: req.session.login
    })
};

exports.delete = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send({
            message: 'logout'
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};