// MODULES
var request = require('request');
var querystring = require('querystring');

var redirect_uri = process.env.spotify_redirect_uri || require('../../config').spotify_redirect_uri;
var spotify_client_id = process.env.spotify_client_id || require('../../config').spotify_client_id;
var spotify_client_secret = process.env.spotify_client_secret || require('../../config').spotify_client_secret;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function loginAuth(res) {
  res.redirect(generateLoginURL());
}

function generateLoginURL() {
  var state = generateRandomString(16);

  var scope = 'user-read-private user-read-email';

  return 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
}

function handleCallback(code) {
  // your application requests refresh and access tokens

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
        console.log(body);
      });

    } else {
      console.log("Something went wrong here");
    }
  });
}

exports.loginAuth = loginAuth;
exports.generateLoginURL = generateLoginURL;
exports.handleCallback = handleCallback;
