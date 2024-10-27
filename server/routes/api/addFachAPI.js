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


    connection.query('INSERT INTO notenplaner.faecher(`userid`, `fachname`) VALUES ("' + req.body.userid + '", "' + req.body.fachname + '")', function (err, rows, fields) {
        if (err) {
            throw err;
        }

        res.status(200).json({
            status: 'Created',
            id: req.body.userid,
            fachname: req.body.fachname,
            date: new Date(),
        });

        connection.end();
    });

});

module.exports = router;