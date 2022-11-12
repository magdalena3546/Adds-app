const Ad = require('../models/ad.model');
const getImageFileType = require('../utils/getImageFileType');
const User = require('../models/user.model');
const fs = require('fs');

exports.getAll = async (req, res) => {
    try {
        res.json(await Ad.find().populate('user'));
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

exports.getOne = async (req, res) => {
    try {
        const elm = await Ad.findById(req.params.id).populate('user');
        if (!elm) res.status(404).json({
            message: 'Not found'
        });
        else res.json(elm);
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

exports.add = async (req, res) => {
    try {
        const {
            title,
            content,
            date,
            price,
            place,

        } = req.body;
        const user = await User.findOne({
            login: req.session.login
        });
        const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
        if (title && typeof title === 'string' && content && typeof content === 'string' && date && typeof date === 'string' && price && place && typeof place === 'string' && user && (title.length >= 10 && title.length <= 50) && (content.length >= 20 && content.length <= 1000)) {
            if (req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
                const newAd = new Ad({
                    title,
                    content,
                    date,
                    price,
                    image: req.file.filename,
                    place,
                    user: user._id,
                });
                await newAd.save();
                res.json({
                    message: 'OK'
                });
            }
        } else {
            fs.unlinkSync(req.file.path);
            res.status(400).json({
                message: 'bad request'
            });
        }
    } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({
            message: err
        });
    }
};

exports.delete = async (req, res) => {

    try {
        const elm = await Ad.findById(req.params.id).populate('user');
        if (elm.user.login === req.session.login) {
            if (elm) {
                await Ad.deleteOne({
                    _id: req.params.id
                });
                res.json({
                    message: 'OK'
                })
            } else res.status(404).json({
                message: 'Not found...'
            });
        } else {
            res.status(401).send({
                message: 'Unauthorized'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

exports.update = async (req, res) => {
    const {
        title,
        content,
        date,
        price,
        place
    } = req.body;
    try {
        const elm = await Ad.findById(req.params.id).populate('user');
        if (elm) {
            if (elm.user.login === req.session.login) {
                const fileType = req.file ? await getImageFileType(req.file) : 'unknown';
                if (title && typeof title === 'string' && content && typeof content === 'string' && date && typeof date === 'string' && price && place && typeof place === 'string' && (title.length >= 10 && title.length <= 50) && (content.length >= 20 && content.length <= 1000)) {
                    if (req.file) {
                        if (['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
                            const newAd = await Ad.updateOne({
                                _id: req.params.id
                            }, {
                                $set: {
                                    title: title,
                                    content: content,
                                    date: date,
                                    price: price,
                                    image: req.file.filename,
                                    place: place
                                }
                            });
                            fs.unlinkSync(`./public/uploads/${elm.image}`);
                            res.json({
                                message: 'OK'
                            })
                        }
                    } else {
                        const newAd = await Ad.updateOne({
                            _id: req.params.id
                        }, {
                            $set: {
                                title: title,
                                content: content,
                                date: date,
                                price: price,
                                place: place
                            }
                        });
                        res.json({
                            message: 'OK'
                        })
                    }
                } else {
                    fs.unlinkSync(req.file.path);
                    res.status(400).json({
                        message: 'bad request'
                    });
                }
            } else {
                fs.unlinkSync(req.file.path);
                res.status(401).send({
                    message: 'Unauthorized'
                })
            }
        } else {
            fs.unlinkSync(req.file.path);
            res.status(404).json({
                message: 'Not found...'
            })
        }
    } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({
            message: err
        });
    }
};

exports.search = async (req, res) => {
    try {
        const elm = await Ad.find({
            title: {
                $regex: req.params.searchPhrase
            }
        });
        if (!elm) res.status(404).json({
            message: 'Not found'
        });
        else res.json(elm);
    } catch (err) {
        res.status(500).json({
            message: err
        });
    }
}