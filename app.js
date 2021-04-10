var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const expressJwt = require('express-jwt')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shenzhenRouter = require('./routes/shenzhen');
const token = require("./util/jwt");


var app = express();
// 解決跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Content-Length,Accept");
    next();
});

// jwt
app.use((req,res,next)=>{
    const path = ['/user/login', '/user/add']
    if(path.some((item)=>{
        return req.url.match(new RegExp(item))
    })){
        next()
        return;
    }
    if(!req.headers.cookie){
        res.status(401).send('认证无效，请重新登录。');
    }
    let reqToken = req.headers.cookie.split('token=')[1]
    if(token.decrypt(reqToken)){
        next()
    }else{
        res.status(401).send('认证无效，请重新登录。');
    }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/shenzhen', shenzhenRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;