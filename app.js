require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const initMongo = require("./db");
const morgan = require('morgan')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080
const HOST_NAME = process.env.HOST || "localhost"

initMongo().then(console.log).catch(console.log);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('combined'))
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    logger(err)
    res.status(err.status || 500)

    if (err.status === 404) {
        res.json({msg: "404 Not found", error: err})
    } else {
        res.json({msg: "Error occurred", error: err})
    }
});
// may replace this with whatever
function logger(err) {
    // console.error(err)
}

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server started at ${HOST_NAME}:${PORT}`)
})


module.exports = app