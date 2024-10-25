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
    
    connection.connect();
    
    connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });
    
    connection.end();

    /*
    res.status(200).json({
        status: 'Authorized',
        message: 'Eingeloggt als NAME',
        id: -1,
        name: 'NAME',
        date: new Date(),
        sessionID: -1
    });
    */
    res.status(403).json({
        status: 'Unauthorized',
        message: 'Falscher Benutzername oder Passwort.',
        id: -1,
        name: '',
        date: new Date(),
        sessionID: -1,
    });
});

module.exports = router;
