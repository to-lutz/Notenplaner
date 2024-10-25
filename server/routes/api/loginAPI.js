var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();


/* POST login authorization. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    
    console.log(req.body);

    connection.connect();

    connection.query('SELECT * FROM users.user WHERE username="' + req.body.username +'"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {

            res.status(200).json({
                status: 'Authorized',
                message: 'Eingeloggt als NAME',
                id: -1,
                name: 'NAME',
                date: new Date(),
                sessionID: -1
            });

        } else {

            res.status(403).json({
                status: 'Unauthorized',
                message: 'Falscher Benutzername oder Passwort.',
                id: -1,
                name: '',
                date: new Date(),
                sessionID: -1,
            });

        }
    });
    
    connection.end();
});

module.exports = router;
