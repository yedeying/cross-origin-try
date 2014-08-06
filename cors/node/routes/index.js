var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  var arr = [];
  for(var i in req)
    arr.push(i);
  arr.sort();
  for(var i in arr)
    console.log(arr[i]);
  console.dir(req.param('data'));
  // console.dir(req);
  res.send({
    name: 'yedeying',
    age: 20
  });
});

module.exports = router;