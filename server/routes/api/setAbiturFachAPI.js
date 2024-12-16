var express = require('express');
var router = express.Router();
var mysql = require('mysql');
require('dotenv').config();

/* POST set setting. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    connection.connect();

    const { userid, fachid, abiturid } = req.body;

    let afb;
    const selectQuery = 'SELECT anforderungsbereich FROM notenplaner.faecher WHERE userid = ? AND id = ?';
    connection.query(selectQuery, [userid, fachid], (err, rows) => {
        if (err) {
            connection.end();
            return res.status(500).json({
                status: 'Error',
                message: 'Failed to fetch anforderungsbereich',
                error: err
            });
        }

        if (rows.length === 0) {
            connection.end();
            return res.status(404).json({
                status: 'Not Found',
                message: 'Fach not found for the given userid and fachid'
            });
        }

        afb = rows[0].anforderungsbereich;

        const checkQuery = 'SELECT * FROM notenplaner.abitur WHERE userid = ? AND abiturfachid = ?';
        connection.query(checkQuery, [userid, abiturid], (err, checkResults) => {
            if (err) {
                connection.end();
                return res.status(500).json({
                    status: 'Error',
                    message: 'Failed to check existing abitur record',
                    error: err
                });
            }

            if (checkResults.length > 0) {
                const updateQuery = 'UPDATE notenplaner.abitur SET fachid = ?, anforderungsbereich = ? WHERE userid = ? AND abiturfachid = ?';
                connection.query(updateQuery, [fachid, afb, userid, abiturid], (err, updateResults) => {
                    if (err) {
                        connection.end();
                        return res.status(500).json({
                            status: 'Error',
                            message: 'Failed to update abitur record',
                            error: err
                        });
                    }

                    res.status(200).json({
                        status: 'Updated',
                        date: new Date()
                    });

                    connection.end();
                });
            } else {
                const insertQuery = 'INSERT INTO notenplaner.abitur (userid, abiturfachid, fachid, anforderungsbereich) VALUES (?, ?, ?, ?)';
                connection.query(insertQuery, [userid, abiturid, fachid, afb], (err, insertResults) => {
                    if (err) {
                        connection.end();
                        return res.status(500).json({
                            status: 'Error',
                            message: 'Failed to insert abitur record',
                            error: err
                        });
                    }

                    res.status(201).json({
                        status: 'Inserted',
                        date: new Date()
                    });

                    connection.end();
                });
            }
        });
    });

});

module.exports = router;