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

    connection.query('UPDATE users.settings SET settingsvalue="' + req.body.value + '" WHERE settingsname="' + req.body.name +'" AND userid="' + req.body.userid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            res.status(200).json({
                status: 'Updated',
                userid: rows[0].userid,
                name: rows[0].settingsname,
                value: rows[0].settingsvalue,
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
