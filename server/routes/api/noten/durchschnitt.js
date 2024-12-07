var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();


/* POST durchschnitt. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    connection.query('SELECT * FROM notenplaner.noten WHERE userid="' + req.body.userid + '" AND halbjahr=' + req.body.semester, function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let id = rows[0].userid;

            // TODO Durchschnitt with oral and written grades

            let total = 0;
            let amt = rows.length;
            for (row in rows) {
                total+=rows[row].notenpunkte;
            }

            res.status(200).json({
                status: 'Found',
                userid: id,
                average: total/amt,
                date: new Date(),
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
