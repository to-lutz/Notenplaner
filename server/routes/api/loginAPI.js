var express = require('express');
var router = express.Router();
var path = require('path');

/* POST login authorization. */
router.post('/', function(req, res, next) {
    res.status(200).send("Authorized");
});

module.exports = router;
