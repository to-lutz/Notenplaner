var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();


/* POST login authorization. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    let hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    connection.query('SELECT * FROM users.user WHERE username="' + req.body.username +'" AND password="' + hashedPassword + '"', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length != 0) {
            let sessID = new Date().getTime() * rows[0].id;
            let username = rows[0].username;
            let id = rows[0].id;
            
            if (rows[0].active != "1") {
                res.status(403).json({
                    status: 'Unauthorized',
                    message: 'Account noch nicht verifiziert',
                    id: -1,
                    name: '',
                    date: new Date(),
                    sessionID: -1,
                });
                connection.end();
                return;
            }

            connection.query("INSERT INTO `users`.`sessionids`(`sessionid`,`username`,`userid`) VALUES(" + sessID +",'" + rows[0].username + "'," + rows[0].id + ");", (err, rows, fields) => {
                if (err) throw err;
                
                res.status(200).json({
                    status: 'Authorized',
                    message: 'Eingeloggt als ' + username,
                    id: id,
                    name: username,
                    date: new Date(),
                    sessionID: sessID,
                });

                connection.end();
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

            connection.end();


        }
    });

});

module.exports = router;
