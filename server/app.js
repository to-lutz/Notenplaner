/* .env Scheme 
DB_HOST=
DB_USER=
DB_PASS=
MAIL=
MAIL_PASS=
API_KEY=
API_MAX_REQUESTS=
API_RATE_LIMIT_TIME_MINUTES=
*/

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
var gradesRouter = require('./routes/grades');

var loginAPIRouter = require('./routes/api/loginAPI');
var registerAPIRouter = require('./routes/api/registerAPI');
var sessionIDAPIRouter = require('./routes/api/sessionIdAPI');
var sessionIDRemoveAPIRouter = require('./routes/api/sessionIdRemoveAPI');
var addFachAPIRouter = require('./routes/api/addFachAPI');
var getFachAPIRouter = require('./routes/api/getFachAPI');
var getFachBatchAPIRouter = require('./routes/api/getFachBatchAPI');
var getFachByNameAPIRouter = require('./routes/api/getFachByNameAPI');
var updateFachAPIRouter = require('./routes/api/updateFachAPI');
var getFaecherAPIRouter = require('./routes/api/getFaecherAPI');
var getSettingAPIRouter = require('./routes/api/getSettingAPI');
var setSettingAPIRouter = require('./routes/api/setSettingAPI');
var setAbiturFachAPIRouter = require('./routes/api/setAbiturFachAPI');
var getAbiturFachAPIRouter = require('./routes/api/getAbiturFachAPI');

var verifyAPIRouter = require('./routes/api/verifyAPI');

var notendurchschnittRouter = require('./routes/api/noten/durchschnitt');
var topsubjectsRouter = require('./routes/api/noten/topsubjects');
var getNotenRouter = require('./routes/api/noten/getNotenAPI');
var addNoteRouter = require('./routes/api/noten/addNoteAPI');

var getKursNoteRouter = require('./routes/api/noten/abitur/getKursNote');
var getKursNoteBatchRouter = require('./routes/api/noten/abitur/getKursNoteBatch');
var getDurchschnittFromPointsRouter = require('./routes/api/noten/abitur/durchschnittFromPoints');

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
app.use('/grades', gradesRouter);

// API Routes
app.use('/api', apiKeyMiddleware, limiter);
app.use('/api/login', loginAPIRouter);
app.use('/api/register', registerAPIRouter);
app.use('/api/sessionid', sessionIDAPIRouter);
app.use('/api/sessionidremove', sessionIDRemoveAPIRouter);
app.use('/api/addfach', addFachAPIRouter);
app.use('/api/getfach', getFachAPIRouter);
app.use('/api/getfachbatch', getFachBatchAPIRouter);
app.use('/api/getfachbyname', getFachByNameAPIRouter);
app.use('/api/updatefach', updateFachAPIRouter);
app.use('/api/getfaecher', getFaecherAPIRouter);
app.use('/api/getsetting', getSettingAPIRouter);
app.use('/api/setsetting', setSettingAPIRouter);
app.use('/api/setabiturfach', setAbiturFachAPIRouter);
app.use('/api/getabiturfach', getAbiturFachAPIRouter);

app.use('/verify', verifyAPIRouter);

// Noten API Routes
app.use('/api/noten/durchschnitt', notendurchschnittRouter);
app.use('/api/noten/topsubjects', topsubjectsRouter);
app.use('/api/noten/getnoten', getNotenRouter);
app.use('/api/noten/addnote', addNoteRouter);

app.use('/api/noten/abitur/getkursnote', getKursNoteRouter);
app.use('/api/noten/abitur/getkursnotebatch', getKursNoteBatchRouter);
app.use('/api/noten/abitur/durchschnittfrompoints', getDurchschnittFromPointsRouter);

module.exports = app;
