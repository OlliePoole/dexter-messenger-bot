var facebook_handler         = require('../bot/dexter').handler;
var login_handler            = require('../bot/dexter').handleSuccessfulLogin;
var spotify_callback_handler = require('../bot/auth/spotify-auth').handleCallback;

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

    if (mode === 'subscribe' && token === process.env.facebook_token || require('../config').facebook_token) {
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

  app.get('/spotify/callback', function (req, res) {
    var code = req.query.code;
    // var state = req.query.state;
    //
    // // TODO: Do something useful with the creds.
    // console.log("Received spotify callback");
    // console.log("Code: " + code);
    // console.log("State: " + state);

    // TODO: Check if user has already logged in.
    spotify_callback_handler(code);
    login_handler();

    res.render('login_successful');
  });
};
