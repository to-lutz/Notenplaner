var express = require('express');
var router = express.Router();
var path = require('path');

/* POST login authorization. */
router.post('/', function(req, res, next) {
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
