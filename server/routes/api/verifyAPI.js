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

module.exports = router;
