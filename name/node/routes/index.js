var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({
    name: '叶德颖',
    age: 20
  });
});

module.exports = router;