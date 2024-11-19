var express = require('express');
var router = express.Router();
var path = require('path');

/* GET grades page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../../client/grades.html"));
});

module.exports = router;
