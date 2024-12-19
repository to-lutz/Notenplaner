var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST add Note. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();


    connection.query('INSERT INTO notenplaner.noten(`userid`, `fachid`, `notenpunkte`, `halbjahr`, `beschreibung`, `gewichtung`) VALUES (' + req.body.userid + ', ' + req.body.fachid + ', ' + req.body.notenpunkte + ', ' + req.body.halbjahr + ', "' + req.body.beschreibung + '", "' + req.body.gewichtung + '")', function (err, rows, fields) {
        if (err) {
            throw err;
        }

        res.status(200).json({
            status: 'Created',
            id: req.body.userid,
            fachid: req.body.fachname,
            np: req.body.notenpunkte,
            halbjahr: req.body.hj,
            description: req.body.beschreibung,
            date: new Date(),
        });

        connection.end();
    });

});

module.exports = router;
