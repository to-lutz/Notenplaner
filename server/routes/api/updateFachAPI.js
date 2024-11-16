var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST update fach. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();


    connection.query('UPDATE notenplaner.faecher SET ' + req.body.setting + '="' + req.body.value + '" WHERE userid="' + req.body.userid + '" AND id=' + req.body.fachid, function (err, rows, fields) {
        if (err) {
            throw err;
        }

        if (req.body.setting == "isProfilfach" && req.body.value == true) {
            // TODO: Check for previous profilfach and set that to false

            updateAbiFach(req.body.fachid, req.body.userid, 0);
        }

        res.status(200).json({
            status: 'Updated',
            id: req.body.userid,
            fachid: req.body.fachid,
            date: new Date(),
        });

        connection.end();
    });

});


let updateAbiFach = function (fachid, userid, abiturid) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('UPDATE notenplaner.abitur SET fachid="' + fachid + '" WHERE userid="' + userid +'" AND abiturfachid="' + abiturid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {

            // TODO: Get Anforderungsbereich and Set

            connection.end();
        } else {

            connection.end();
        }
    });
}

module.exports = router;
