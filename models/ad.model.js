const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },
    date: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: false,
        ref: 'User'
    }
});

module.exports = mongoose.model('Ad', adSchema);