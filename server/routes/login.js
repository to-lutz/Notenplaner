var express = require('express');
var router = express.Router();
var path = require('path');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../../client/login.html"));
});

module.exports = router;
