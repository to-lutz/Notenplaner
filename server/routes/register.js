var express = require('express');
var router = express.Router();
var path = require('path');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../../client/register.html"));
});

module.exports = router;
