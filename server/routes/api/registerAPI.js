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

    let username = req.body.username;
    let email = req.body.email;
    let passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

    connection.query('INSERT INTO users.user(`username`, `email`, `password`) VALUES ("' + username + '", "' + email + '", "' + passwordHash + '")', function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.status(400).json({
                    status: 'Not Created',
                    message: 'Username oder E-Mail existiert bereits!',
                    date: new Date(),
                });
            }
            connection.end();
            return;
        }

        res.status(200).json({
            status: 'Created',
            name: username,
            mail: email,
            date: new Date(),
        });

        connection.end();
    });

});

module.exports = router;
