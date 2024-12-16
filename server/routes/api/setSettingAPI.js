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

    const { name, value, userid } = req.body;

    const checkQuery = `SELECT * FROM users.settings WHERE settingsname = ? AND userid = ?`;
    connection.query(checkQuery, [name, userid], function (err, results) {
        if (err) {
            connection.end();
            return res.status(500).json({
                status: 'Error',
                message: 'Database query error',
                error: err
            });
        }

        if (results.length > 0) {
            const updateQuery = `UPDATE users.settings SET settingsvalue = ? WHERE settingsname = ? AND userid = ?`;
            connection.query(updateQuery, [value, name, userid], function (err, updateResults) {
                if (err) {
                    connection.end();
                    return res.status(500).json({
                        status: 'Error',
                        message: 'Failed to update setting',
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
            const insertQuery = `INSERT INTO users.settings (settingsname, settingsvalue, userid) VALUES (?, ?, ?)`;
            connection.query(insertQuery, [name, value, userid], function (err, insertResults) {
                if (err) {
                    connection.end();
                    return res.status(500).json({
                        status: 'Error',
                        message: 'Failed to insert setting',
                        error: err
                    });
                }

                res.status(201).json({
                    status: 'Updated',
                    date: new Date()
                });

                connection.end();
            });
        }
    });

});

module.exports = router;
