const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = 'url to remote db';
else dbUri = 'mongodb://localhost:27017/AddsDB';

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to the database')
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000')
})

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use((req, res) => {
    res.status(404).send('404 not found...');
});
// app.use(express.static(path.join(__dirname, '/client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/build/index.html'));
//   });