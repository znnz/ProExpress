/* sample data */
var book = {
    name: 'Practical Node.JS',
    publisher: 'znnz',
    keywords: 'node.js express.js mongodb websocket oauth',
    discount: 'PNJS15'
}

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    compression = require('compression'),
    methodOverride = require("method-override"),
    responseTime = require("response-time"),
    serveIndex = require("serve-index"),
    vhost = require("vhost"),
    busyboy = require("connect-busboy"),
    errorhandler = require("errorhandler"),
    timeout = require('timeout'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    uuid = require('node-uuid'),
    routes = require('./routes/index'),
    session=require('express-session'),
    csrf=require('csurf');
    users = require('./routes/users');

var app = express();

console.log(app.get('env'));

// app setting
app.set("json spaces", 4);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);
app.set('trust proxy', true);
app.set('jsonp callback name', 'cb');
app.set('strict routing', true);
app.set('etag', function (body, encoding) {
    return require('crypto').createHash('md5').update(body).digest('hex');
});
app.set('json repacer', function (key, value) {
    if (key === 'discount') return undefined;
    else return value;
});


// view engine setup
app.set('view cache', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','favicon.ico')));
app.use(compression({threshold: 1}));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(responseTime(4));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    genid:function(req){
        return uuid()
    },
    secret:'blue katty'
}));
app.use(csrf());
app.use('/shared',serveIndex(path.join('public','shared'),{'icons':true}));
app.use(express.static(path.join(__dirname, 'public'),{
    maxAge:86400000
}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function (req, res, next) {
    return next();
});

app.use('/admin', function (req, res, next) {
    next();
});

app.use('/', routes);
app.use('/users', users);


app.get('/jsonp', function (request, response) {
    response.jsonp(book);
});
app.get('/json', function (request, response) {
    response.send(book);
});
app.get('/users', function (request, response) {
    response.send('users');
});
app.get('/users/', function (request, response) {
    response.send('users/');
});
/*
app.get(
    '/slow-request',
    timeout('1s'),
    function (request, response, next) {
        setTimeout(function () {
            if (request.timedout)return false;
            return next();
        }, 999 + Math.round(Math.random()));
    }, function (request, response, next) {
        response.send('0k');
    });
    */
app.get('/compression', function (request, response) {
    response.render('index');
});
app.delete('/purchase-orders',function(request,response){
    console.log('The DELETE route has been triggered');
    response.status(204).end();
});
app.get('/response-time',function(request,response){
   setTimeout(function () {
      response.status(200).end();
   },513);
});
app.use(errorhandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
