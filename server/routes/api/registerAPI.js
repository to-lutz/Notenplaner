var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
require('dotenv').config();
var os = require('os');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
});

/* POST create user. */
router.post('/', function (req, res, next) {

    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    connection.connect();

    let username = req.body.username;
    let email = req.body.email;
    let passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

    let verificationKey = crypto.createHash('md5').update(req.body.username + (new Date().toISOString())).digest('hex');

    connection.query('INSERT INTO users.user(`username`, `email`, `password`, `verification_key`) VALUES ("' + username + '", "' + email + '", "' + passwordHash + '", "' + verificationKey + '")', function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                console.log(err);
                if (err.sqlMessage.includes("username_UNIQUE")) {
                    res.status(400).json({
                        status: 'Not Created',
                        message: 'Benutzername existiert bereits!',
                        date: new Date(),
                    });
                } else if (err.sqlMessage.includes("email_UNIQUE")) {
                    res.status(400).json({
                        status: 'Not Created',
                        message: 'E-Mail existiert bereits!',
                        date: new Date(),
                    });
                }
            }
            connection.end();
            return;
        }

        let userid = rows.insertId;

        const ownUrl = req.protocol + "://" + req.get('host');

        let mailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    text-align: center;
                }
                .btn {
                    position: relative;
                    padding: 15px 75px;
                    margin: 5px;
                    display: inline-block;
                    font-size: 25px;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #fff;
                    background: transparent;
                    border: 1px solid transparent;
                    font-family: "OceanWide", Arial, Helvetica, sans-serif;
                    text-align: center;
                    cursor: pointer;
                }
                .footer {
                    font-size: 12px;
                    color: #999999;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Notenplaner | Account-Verifizierung</h2>
                <p>Vielen Dank, dass Sie sich registriert haben! Bitte klicken Sie auf den Button unten, um Ihren Account zu verifizieren:</p>
                <a href="${ownUrl}/api/verify?token=${verificationKey}" class="btn">Account verifizieren</a>
                <p>Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</p>
                <div class="footer">
                    Notenplaner
                </div>
            </div>
        </body>
        </html>`;

        // Send verification email
        var mailOptions = {
            from: "no-reply@notenplaner.de",
            to: email,
            subject: "Notenplaner | E-Mail verifizieren",
            text: "Sehr geehrter Nutzer,\nBitte verifizieren sie ihre E-Mail über folgenden Link:\n\n" + ownUrl + "/api/verify?token=" + verificationKey + "\n\nMit freundlichen Grüßen,\nihr Notenplaner Team",
            html: mailHTML
        };

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error while sending mail: ' + error);
            } else {
                console.log('Message sent: %s', info.messageId);
            }
            transport.close();
        });

        // Set default abitur faecher
        for (let i = 0; i < 5; i++) {

            connection.query('INSERT INTO notenplaner.abitur(`userid`, `fachid`, `abiturfachid`) VALUES ("' + userid + '", "0","' + i + '")', function (err, rows, fields) {
                if (err) {
                    connection.end();
                    res.status(400).json({
                        status: 'Error',
                        message: 'Error when setting Abitur subjects in DB',
                        date: new Date(),
                    });
                    return;
                }
            });

        }

        res.status(200).json({
            status: 'Created',
            name: username,
            mail: email,
            date: new Date(),
        });

        connection.end();
    });

});

module.exports = router;
