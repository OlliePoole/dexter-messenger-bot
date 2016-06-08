var facebook_handler = require('../bot/dexter').handler;
var config = require('../config');

module.exports = function (app) {

  //public pages
  app.get('/', function (req, res) {
    res.render('index', {title: 'Meet Dexter'});
  });

  app.get('/facebook', function (req, res) {
    console.log("Received facebook subscribe request");

    //This enables subscription to the webhooks
    var mode = req.query['hub.mode'];
    var token = req.query['hub.verify_token'];

    if (mode === 'subscribe' && token === config.facebook_token) {
      var challenge = req.query['hub.challenge'];
      res.send(challenge);
    }
    else {
      res.send("Incorrect verify token")
    }
  });

  app.post('/facebook', function (req, res) {

    facebook_handler(req.body);
    res.send('ok')
  });

  app.get('/spotify/login', function (res, req) {
    spotify_auth.loginAuth(res);
  });

  app.get('/spotify/callback', function (req, res) {

  });
};
