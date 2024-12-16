var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();

/* POST batch request für mehrere Fach-IDs */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    const { userid, fachIds } = req.body;

    const query = 'SELECT * FROM notenplaner.faecher WHERE userid = ? AND id IN (?)';

    connection.query(query, [userid, fachIds], function (err, rows) {
        if (err) {
            return res.status(500).json({ status: 'Error', message: err.message });
        }

        if (rows.length === 0) {
            return res.status(404).json({ status: 'Not Found' });
        }

        const results = rows.map(row => ({
            status: 'Found',
            id: row.id,
            name: row.fachname,
            by: row.userid,
            farbe: row.farbe,
            isProfilfach: row.isProfilfach,
            gewichtungSchrift: row.gewichtungSchriftlich,
            gewichtungMuendl: row.gewichtungMuendlich,
            anforderungsbereich: row.anforderungsbereich,
            date: new Date()
        }));

        res.status(200).json(results);

        connection.end();
    });

});

module.exports = router;