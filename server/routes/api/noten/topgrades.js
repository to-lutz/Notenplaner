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

    connection.query('SELECT * FROM notenplaner.noten WHERE userid="' + req.body.userid + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let id = rows[0].userid;

            grades = [];
            for (row in rows) {
                grades.push({
                    fachid: rows[row].fachid,
                    np: rows[row].notenpunkte
                })
            }

            let topgrades = groupAndAverage(grades).sort((a, b) => b.np - a.np);

            res.status(200).json({
                status: 'Found',
                userid: id,
                noten: topgrades,
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

function groupAndAverage(array) {
    const grouped = array.reduce((acc, current) => {
        if (!acc[current.fachid]) {
            acc[current.fachid] = { fachid: current.fachid, npSum: 0, count: 0 };
        }
        acc[current.fachid].npSum += current.np;
        acc[current.fachid].count += 1;
        return acc;
    }, {});

    // Durchschnitt berechnen und in ein neues Array umwandeln
    return Object.values(grouped).map(item => ({
        fachid: item.fachid,
        np: item.npSum / item.count  // Durchschnitt berechnen
    }));
}

module.exports = router;
