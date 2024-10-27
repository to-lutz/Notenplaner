var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var loginAPIRouter = require('./routes/api/loginAPI');
var registerAPIRouter = require('./routes/api/registerAPI');
var sessionIDAPIRouter = require('./routes/api/sessionIdAPI');
var sessionIDRemoveAPIRouter = require('./routes/api/sessionIdRemoveAPI');
var addFachAPIRouter = require('./routes/api/addFachAPI');

var notendurchschnittRouter = require('./routes/api/noten/durchschnitt');
var topgradeRouter = require('./routes/api/noten/topgrades');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static(path.join(__dirname, '../client')));
app.use(favicon(path.join(__dirname, '../client/images/favicon', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// API Routes
app.use('/api/login', loginAPIRouter);
app.use('/api/register', registerAPIRouter);
app.use('/api/sessionid', sessionIDAPIRouter);
app.use('/api/sessionidremove', sessionIDRemoveAPIRouter);
app.use('/api/addfach', addFachAPIRouter);

// Noten API Routes
app.use('/api/noten/durchschnitt', notendurchschnittRouter);
app.use('/api/noten/topgrades', topgradeRouter);

module.exports = app;
