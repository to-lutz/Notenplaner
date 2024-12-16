var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();


/* POST getKursNote. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    let abiturrel = 0;

    connection.query('SELECT * FROM notenplaner.faecher WHERE userid="' + req.body.userid + '" AND id="' + req.body.fachid + '"', (err, rows, fields) => {
        if (err) throw err;
        if (rows.length != 0) {
            abiturrel = rows[0].abiturrelevant;
        }
    });

    connection.query('SELECT * FROM notenplaner.noten WHERE userid="' + req.body.userid + '" AND fachid="' + req.body.fachid + '" AND halbjahr=' + req.body.semester, function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let id = rows[0].userid;
            let noten = 0;
            let gewichtungSum = 0;

            for (let row of rows) {
                noten+=(row.notenpunkte * row.gewichtung);
                gewichtungSum+=row.gewichtung;
            }
            
            noten = noten / gewichtungSum;

            res.status(200).json({
                status: 'Found',
                userid: id,
                fachid: rows[0].fachid,
                note: noten,
                abiturrelevant: abiturrel,
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
