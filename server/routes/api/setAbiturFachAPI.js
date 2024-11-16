var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST set setting. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    let afb;
    connection.query('SELECT anforderungsbereich FROM notenplaner.faecher WHERE userid=' + req.body.userid + ' AND id=' + req.body.fachid, (err, rows, fields) => {
        afb = rows[0].anforderungsbereich;

        connection.query('UPDATE notenplaner.abitur SET fachid="' + req.body.fachid + '", anforderungsbereich=' + afb + ' WHERE userid="' + req.body.userid + '" AND abiturfachid="' + req.body.abiturid + '"', function (err, rows, fields) {
            if (err) throw err;
            if (rows.length != 0) {

                res.status(200).json({
                    status: 'Updated',
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
});

module.exports = router;
