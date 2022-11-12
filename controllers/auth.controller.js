const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');

exports.register = async (req, res) => {
    try {
        const {
            login,
            password,
            phone
        } = req.body;
        const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
        if (login && typeof login === 'string' && password && typeof password === 'string' && phone && typeof phone === 'string' && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
            const userWithLogin = await User.findOne({
                login
            });
            if (userWithLogin) {
                fs.unlinkSync(req.file.path);
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
            password
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
                    req.session.login = user.login
                    return res.status(200).send({
                        message: 'Hello ' + req.session.login
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
        message: "You are logged!"
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