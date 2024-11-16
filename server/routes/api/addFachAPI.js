var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST create user. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();


    connection.query('INSERT INTO notenplaner.faecher(`userid`, `fachname`, `farbe`, `isProfilfach`, `gewichtungSchriftlich`, `gewichtungMuendlich`, `anforderungsbereich`) VALUES ("' + req.body.userid + '", "' + req.body.fachname + '", "' + req.body.farbe + '", "' + req.body.isprofilfach + '", ' + req.body.gewichtSchriftl + ', ' + req.body.gewichtMuendl + ', ' + req.body.anforderungsbereich + ')', function (err, rows, fields) {
        if (err) {
            throw err;
        }

        res.status(200).json({
            status: 'Created',
            id: req.body.userid,
            fachname: req.body.fachname,
            farbe: req.body.farbe,
            date: new Date(),
        });

        connection.end();
    });

});

module.exports = router;
