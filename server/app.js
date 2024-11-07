var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cors = require('cors');
var apiKeyMiddleware = require('./middleware/apiKeyMiddleware');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var settingsRouter = require('./routes/settings');

var loginAPIRouter = require('./routes/api/loginAPI');
var registerAPIRouter = require('./routes/api/registerAPI');
var sessionIDAPIRouter = require('./routes/api/sessionIdAPI');
var sessionIDRemoveAPIRouter = require('./routes/api/sessionIdRemoveAPI');
var addFachAPIRouter = require('./routes/api/addFachAPI');
var getFachAPIRouter = require('./routes/api/getFachAPI');
var getFaecherAPIRouter = require('./routes/api/getFaecherAPI');
var getSettingAPIRouter = require('./routes/api/getSettingAPI');
var setSettingAPIRouter = require('./routes/api/setSettingAPI');

var notendurchschnittRouter = require('./routes/api/noten/durchschnitt');
var topsubjectsRouter = require('./routes/api/noten/topsubjects');
var getNotenRouter = require('./routes/api/noten/getNotenAPI');

var rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: process.env.API_RATE_LIMIT_TIME_MINUTES * 60 * 1000, // 15 Minuten
    max: process.env.API_MAX_REQUESTS // maximal 100 Anfragen pro IP innerhalb von 15 Minuten
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());       // to support JSON-encoded bodies
app.use(cors({
    origin: '127.0.0.1',
    methods: ['GET', 'POST']
}));
app.use(express.static(path.join(__dirname, '../client')));
app.use(favicon(path.join(__dirname, '../client/images/favicon', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/settings', settingsRouter);

// API Routes
app.use('/api', apiKeyMiddleware, limiter);
app.use('/api/login', loginAPIRouter);
app.use('/api/register', registerAPIRouter);
app.use('/api/sessionid', sessionIDAPIRouter);
app.use('/api/sessionidremove', sessionIDRemoveAPIRouter);
app.use('/api/addfach', addFachAPIRouter);
app.use('/api/getfach', getFachAPIRouter);
app.use('/api/getfaecher', getFaecherAPIRouter);
app.use('/api/getsetting', getSettingAPIRouter);
app.use('/api/setsetting', setSettingAPIRouter);

// Noten API Routes
app.use('/api/noten/durchschnitt', notendurchschnittRouter);
app.use('/api/noten/topsubjects', topsubjectsRouter);
app.use('/api/noten/getnoten', getNotenRouter);

module.exports = app;
