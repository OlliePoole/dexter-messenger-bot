var express = require('express');
var router = express.Router();

/* GET home page. */
exports.login = function(req, res){
  res.render('index', { title: 'Login' });
};
