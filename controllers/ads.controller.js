const Ad = require('../models/ad.model');
const router = require('../routes/ads.routes');

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
            image,
            place,
            user
        } = req.body;
        const newAd = new Ad({
            title: title,
            content: content,
            date: date,
            price: price,
            image: image,
            place: place,
            user: user
        });
        await newAd.save();
        res.json({
            message: 'OK'
        });
    } catch (err) {
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
        image,
        place
    } = req.body;
    try {
        const elm = await Ad.findById(req.params.id).populate('user');
        if (elm.user.login === req.session.login) {
            if (elm) {
                await Ad.updateOne({
                    _id: req.params.id
                }, {
                    $set: {
                        title: title,
                        content: content,
                        date: date,
                        price: price,
                        image: image,
                        place: place
                    }
                });
                res.json({
                    message: 'OK'
                })
            } else res.status(404).json({
                message: 'Not found...'
            })
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