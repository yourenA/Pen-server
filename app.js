var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var api = require('./routes/api');
var session = require('express-session');
var cors = require('cors')
var app = express();
app.set('port', (process.env.PORT || 3000));//set设置端口
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: 'demo_test',
    name: 'mydemo',                         //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 30 * 60 * 1000},    //设置maxAge是30分钟，即30分钟后session和相应的cookie失效过期
    resave: false,                         // 每次请求都重新设置session cookie
    saveUninitialized: true                // 无论有没有session cookie，每次请求都设置个session cookie
}));

var whitelist = ['http://localhost:8000', 'http://localhost:3001', 'http://127.0.0.1:3005']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback(new Error('Not allowed by CORS'))
            callback(null, true)
        }
    },
    credentials:true
}

app.use(cors(corsOptions))

// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8000");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1');
//     res.header("Access-Control-Allow-Credentials", true);
//     if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
//     else  next();
// });
var db = require('./models/index');
var connection = db.connection;
app.use('/', routes);
app.use('/api', api);

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

var server = http.createServer(app);

if (connection()) {
    server.listen(app.get('port'), function () {
        console.log('App started, bind port %d, CTRL + C to terminate', app.get('port'))
    });
}