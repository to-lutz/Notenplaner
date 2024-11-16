var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST fach by fachid. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('SELECT * FROM notenplaner.faecher WHERE userid="' + req.body.userid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let faecher = [];
            for (let row of rows) {
                faecher.push({
                    id: row.id,
                    name: row.fachname,
                    farbe: row.farbe,
                    isProfilfach: row.isProfilfach,
                    gewichtungSchrift: row.gewichtungSchriftlich,
                    gewichtungMuendl: row.gewichtungMuendlich,
                    anforderungsbereich: row.anforderungsbereich
                })
            }
            res.status(200).json({
                status: 'Found',
                subjects: faecher,
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
