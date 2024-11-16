var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* GET verify account. */
router.get('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('SELECT * FROM users.user WHERE verification_key="' + req.query.token + '"', function (err, rows, fields) {
        if (err) {
            throw err;
        }

        if (rows.length != 0) {
            connection.query("UPDATE users.user SET active=1,verification_key=NULL WHERE id=" + rows[0].id, (err, rows, fields) => {
                if (err) {
                    throw err;
                }
                res.redirect("/");
                connection.end();
            });

        } else {
            res.status(403).json({
                status: "Invalid Verification Token"
            });
            connection.end();
        }


    });

});


let updateAbiFach = function (fachid, userid, abiturid) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    let afb;
    connection.query('SELECT anforderungsbereich FROM notenplaner.faecher WHERE userid=' + userid + ' AND id=' + fachid, (err, rows, fields) => {
        afb = rows[0].anforderungsbereich;

        connection.query('UPDATE notenplaner.abitur SET fachid="' + fachid + '", anforderungsbereich="' + afb + '" WHERE userid="' + userid + '" AND abiturfachid="' + abiturid + '"', function (err, rows, fields) {
            if (err) throw err;
            if (rows.length != 0) {

                connection.end();
            } else {

                connection.end();
            }
        });
    });

}

module.exports = router;
