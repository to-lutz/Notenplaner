var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();


/* POST sessionIdRemove. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('DELETE FROM users.sessionids WHERE sessionid="' + req.body.sessionid + '"', function (err, rows, fields) {
        if (err) throw err;

        res.status(200).json({
            status: 'Deleted',
            id: req.body.sessionid,
            date: new Date(),
        });
        connection.end();
    });
});

module.exports = router;
