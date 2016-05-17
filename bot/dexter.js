
// MODULES
var Botkit = require('botkit');
var os = require('os');
var spotify = require('./spotify');
var sentiment_analysis = require('./sentiment_analysis')
var config = require('../config');

// SETUP
var controller = Botkit.facebookbot({
    debug: true,
    access_token: config.facebook_page_token,
    verify_token: config.facebook_token,
});

var bot = controller.spawn({});

controller.setupWebserver(process.env.port || 4000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});

exports.controller = controller

// EVENTS

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

  bot.startConversation(message,function(err,convo) {

    convo.say('Woof Woof');
    convo.say('Oh hey there human, my name is Dexter');
    convo.say('I have four legs, lots of fur and can help you discover new and great music');

    convo.ask("I don't think we've met before, and I can't smell you from here. So can you tell me your name?", function(response,convo) {

      convo.say('Nice to meet you ' + response.text);
      convo.next();

      convo.say('I need you to login to Spotify, so I can see what music you like to listen to');
      convo.ask("I'm going to open the login in a new tab, is that alright?", function(response, convo) {
        var answer = response.text;

      });

    });


  });
});

var enteredPlaylistName = ""
/// Create playlists
controller.hears(['I have an exam next week, can you create a (.*) playlist',
                  "I'm having a party next week, can you create a (.*) playlist",
                    "I'm having some friends over, can you create a (.*) playlist"],  'message_received', function(bot, message) {

  enteredPlaylistName = message.match[1];

  var playlistGenreAttachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title':'Chilled',
                  'image_url':"http://i.imgur.com/dMEgFKp.png",
                  'buttons':[
                      {
                      'type':'postback',
                      'title':'Select',
                      'payload':'chilled'
                      }
                  ]
              },
              {
                  'title':'Upbeat',
                  'image_url':"http://i.imgur.com/RgUmcTP.png",
                  'buttons':[
                      {
                      'type':'postback',
                      'title':'Select',
                      'payload': 'upbeat'
                      }
                  ]
              },
              {
                  'title':'Rock',
                  'image_url':"http://i.imgur.com/to6MQC8.png",
                  'buttons':[
                      {
                      'type':'postback',
                      'title':'Select',
                      'payload': 'rock'
                      }
                  ]
              },
          ]
      }
  };
  bot.reply(message, "What sort of music would you like in the playlist?");
  bot.reply(message, {
      attachment: playlistGenreAttachment,
  });
});

controller.hears('(.*)', 'message_received', function(bot, message) {
  console.log("General message recieved");

  var userMessage = message.match[1];
  if (userMessage != undefined) {

    // check sentiment
    var sentiment = sentiment_analysis.sentimentForMessage(userMessage);
    if (sentiment < 0) {
      bot.reply(message, "Grrrrrrrrrrr")
    } else {
      bot.reply(message, "Woof! Want to play fetch?")
    }
  }
});


controller.on('facebook_postback', function(bot, message) {

  var payload = message.payload;
  var selectedGenres = []
  var playlistName = "";

  if (payload == 'chilled') {
    selectedGenres = ['chill', 'study', 'sleep', 'lounge']
    playlistName = "" + enteredPlaylistName + " playlist - chilled"

  } else if (payload == 'upbeat') {
    selectedGenres = ['club', 'dance', 'disco', 'edm', 'pop']
    playlistName = "" + enteredPlaylistName + " playlist - upbeat"

  } else if (payload == 'rock') {
    selectedGenres = ['rock', 'hard-rock']
    playlistName = "" + enteredPlaylistName + " playlist - rock"
  }

  // Create spotify playlist
  spotify.createPlaylist(playlistName, selectedGenres, function(playlistLink) {
    bot.reply(message, "Woof Woof! That's dog for 'your playlist has been built!'");
    bot.reply(message, "Your playlist is here: " + playlistLink);
  });

});
