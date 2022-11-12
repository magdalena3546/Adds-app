const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();
const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(
        cors({
            origin: ['http://localhost:3000', 'http://localhost:8000'],
            credentials: true,
        })
    );
}

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000')
})

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = 'url to remote db';
else dbUri = 'mongodb://localhost:27017/AdsDB';

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to the database')
});
db.on('error', err => console.log('Error ' + err));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create(db),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV == 'production',
    },
}));


app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.static(path.join(__dirname, '/public')));
//
app.use(express.static(path.join(__dirname, '/uploads/')));

app.use('/api', adsRoutes);
app.use('/api/auth', authRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
});