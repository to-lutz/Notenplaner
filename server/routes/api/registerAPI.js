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

    let verificationKey = crypto.createHash('md5').update(req.body.username + (new Date().toISOString())).digest('hex');

    connection.query('INSERT INTO users.user(`username`, `email`, `password`, `verification_key`) VALUES ("' + username + '", "' + email + '", "' + passwordHash + '", "' + verificationKey + '")', function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                console.log(err);
                if (err.sqlMessage.includes("username_UNIQUE")) {
                    res.status(400).json({
                        status: 'Not Created',
                        message: 'Benutzername existiert bereits!',
                        date: new Date(),
                    });
                } else if (err.sqlMessage.includes("email_UNIQUE")) {
                    res.status(400).json({
                        status: 'Not Created',
                        message: 'E-Mail existiert bereits!',
                        date: new Date(),
                    });
                }
            }
            connection.end();
            return;
        }

        let userid = rows.insertId;

        // Send verification email

        // Set default abitur faecher
        for (let i = 0; i < 5; i++) {

            connection.query('INSERT INTO notenplaner.abitur(`userid`, `fachid`, `abiturfachid`) VALUES ("' + userid + '", "0","' + i + '")', function (err, rows, fields) {
                if (err) {
                    connection.end();
                    res.status(400).json({
                        status: 'Error',
                        message: 'Error when setting Abitur subjects in DB',
                        date: new Date(),
                    });
                    return;
                }
            });

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
