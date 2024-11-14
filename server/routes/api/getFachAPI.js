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

    connection.query('SELECT * FROM notenplaner.faecher WHERE id="' + req.body.fachid +'" AND userid="' + req.body.userid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            res.status(200).json({
                status: 'Found',
                id: rows[0].id,
                name: rows[0].fachname,
                by: rows[0].userid,
                farbe: rows[0].farbe,
                isProfilfach: rows[0].isProfilfach,
                gewichtungSchrift: rows[0].gewichtungSchrift,
                gewichtungMuendl: rows[0].gewichtungMuendlich,
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
