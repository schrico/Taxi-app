var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

var catalogRouter = require('./routes/catalog');
var indexRouter = require('./routes/index');

var app = express();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = "mongodb://psi049:psi049@localhost:27017/psi049?retryWrites=true&authSource=psi049";

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB)
       .then(() => {console.log("Connected to MongoDB")})
}

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', catalogRouter);
app.use('/', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;




