var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST setting by userid. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('SELECT * FROM notenplaner.abitur WHERE abiturfachid="' + req.body.abiturid +'" AND userid="' + req.body.userid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            res.status(200).json({
                status: 'Found',
                userid: rows[0].userid,
                fachid: rows[0].fachid,
                notenpunkte: rows[0].notenpunkte,
                abiturfachid: rows[0].abiturfachid,
                anforderungsbereich: rows[0].anforderungsbereich,
                date: new Date(),
            });

            connection.end();
        } else {

            res.status(403).json({
                status: 'Not Found',
            });

            connection.end();


        }
    });

});

module.exports = router;
