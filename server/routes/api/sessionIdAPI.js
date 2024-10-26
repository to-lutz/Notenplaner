var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();


/* POST sessionId. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('SELECT * FROM users.sessionids WHERE sessionid="' + req.body.sessionid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let username = rows[0].username;
            let id = rows[0].userid;

            res.status(200).json({
                status: 'Known',
                id: id,
                name: username,
                date: new Date(),
                sessionID: req.body.sessionid,
            });
            connection.end();
        } else {

            res.status(403).json({
                status: 'Unknown',
                id: -1,
                name: '',
                date: new Date(),
                sessionID: -1,
            });

            connection.end();

        }
    });

});

module.exports = router;
