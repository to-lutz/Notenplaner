var express = require('express');
var router = express.Router();
var path = require('path');

/* GET settings page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../../client/settings.html"));
});

module.exports = router;
