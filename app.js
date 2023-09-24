const express = require('express');
const createError = require('http-errors');

//the object for params retrieval in post request
const bodyParser = require("body-parser");
const app = express();


//middle wares-------------------------------------
app.use((req, res, next) => {
    let reqOrigin = req.headers.origin;

    res.header("Access-Control-Allow-Origin", reqOrigin);
    res.header("Access-Control-Allow-Credentials", true);

    //send response ok for options
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", 'GET, OPTIONS, POST, PUT, DELETE');
        res.header("Access-Control-Allow-Headers", 'Origin, Content-Type, Accept, content-type, x-verify, authorization');
        res.status(200).send();
        return;
    }

    //allowed methods for GET
    if (req.method === 'GET') {
        res.header("Access-Control-Allow-Methods", req.method);
    }

    //allowed headers and methods
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        res.header("Access-Control-Allow-Methods", req.method);
        res.header("Access-Control-Allow-Headers", 'Origin, Content-Type, Accept, content-type, x-verify, authorization');
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use('/static', express.static(staticDir, {
//     setHeaders: (res, path, stat) => {
//         //res.set("Content-Type", "image/png");
//     }
// }));

//-------------------------------------middle wares

//global value shared during app running
app.locals.someValue = 0;

//routes-----------------------------------------
const index = require('./routes/index');
app.use('/', index);

//-----------------------------------------routes


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    //console.log('error', err);

    res.status(err.status || 500).send({error: {message: err.message}});
});

module.exports = app;
