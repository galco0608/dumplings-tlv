const PORT = process.env.PORT || 8080
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const ordersRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');

const MONGODB_URI =
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.7sgam.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json()); // application/json

// app.use((req, res, next) => {
//     res.setHeader('Accsess-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });



app.use('/auth', authRoutes);
app.use('/', ordersRoutes);

app.get('/sanity', (req, res) => {
    res.send('running')
})
app.use('/static', express.static(path.join(__dirname, './client/build/static')));

app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, './client/build/') });
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message || 'error';
    res.status(status).json({ message: message });
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(PORT, () => {
            console.log(`app listening at ${PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    });

