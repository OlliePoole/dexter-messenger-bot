// MODULES
var Botkit             = require('botkit');
var os                 = require('os');
var spotify            = require('./spotify');
var spotify_auth       = require('./auth/spotify-auth');
var sentiment_analysis = require('./sentiment_analysis');
var request            = require('request');
var attachmentBuilder  = require('./attachment_builder');

// To allow different functions to reply to messages
var mostRecentMessageReceived;
var mostRecentBotUsed;

var facebook_page_token = process.env.facebook_page_token || require('../config').facebook_page_token;
var facebook_token = process.env.facebook_token || require('../config').facebook_token;

// SETUP
var controller = Botkit.facebookbot({
  debug: true,
  access_token: facebook_page_token,
  verify_token: facebook_token
});

var bot = controller.spawn({});


//subscribe to page events
request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + facebook_page_token,
  function (err, res, body) {
    if (err) {
      controller.log('Could not subscribe to page messages');
    }
    else {
      controller.log('Successfully subscribed to Facebook events:', body);
      console.log('Botkit activated');

      //start ticking to send conversation messages
      controller.startTicking()
    }
  });


// EVENTS
controller.hears(['hello', 'hi', 'hello (.*)', 'hi (.*)'], 'message_received', function (bot, message) {

  bot.startConversation(message, function (err, convo) {

    convo.say('Woof Woof');
    convo.say('Oh hey there human, my name is Dexter');
    convo.say('I have four legs, lots of fur and can help you discover new and great music');

    convo.ask("I don't think we've met before, and I can't smell you from here. So can you tell me your name?",
      function (response, convo) {
        convo.next();

        convo.say('Nice to meet you ' + response.text);
        convo.say('I need you to login to Spotify, so I can see what music you like to listen to');
        convo.say("When you're ready to login, just bark! ['Woof']");

      });
  });
});

controller.hears(['woof'], 'message_received', function (bot, message) {

  mostRecentMessageReceived = message;
  mostRecentBotUsed = bot;

  var auth_url = spotify_auth.generateLoginURL();
  
  bot.reply(message, {
    attachment: attachmentBuilder.createSingleItemAttachment("Login with Spotify", "", "Let's go", auth_url)
  });
});



var enteredPlaylistName = "";

/// Create playlist
controller.hears(['I have an exam next week, can you create a (.*) playlist',
  "I'm having a party next week, can you create a (.*) playlist",
  "I'm having some friends over, can you create a (.*) playlist"], 'message_received', function (bot, message) {

  enteredPlaylistName = message.match[1];

  var playlistGenreAttachment = {

    'type': 'template',
    'payload': {
      'template_type': 'generic',
      'elements': [
        {
          'title': 'Chilled',
          'image_url': "http://i.imgur.com/dMEgFKp.png",
          'buttons': [
            {
              'type': 'postback',
              'title': 'Select',
              'payload': 'chilled'
            }
          ]
        },
        {
          'title': 'Upbeat',
          'image_url': "http://i.imgur.com/RgUmcTP.png",
          'buttons': [
            {
              'type': 'postback',
              'title': 'Select',
              'payload': 'upbeat'
            }
          ]
        },
        {
          'title': 'Rock',
          'image_url': "http://i.imgur.com/to6MQC8.png",
          'buttons': [
            {
              'type': 'postback',
              'title': 'Select',
              'payload': 'rock'
            }
          ]
        }
      ]
    }
  };
  bot.reply(message, "What sort of music would you like in the playlist?");
  bot.reply(message, {
    attachment: playlistGenreAttachment
  });
});

controller.hears('(.*)', 'message_received', function (bot, message) {
  console.log("General message received");

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


controller.on('facebook_postback', function (bot, message) {

  var payload = message.payload;
  var selectedGenres = [];
  var playlistName = "";

  if (payload == 'chilled') {
    selectedGenres = ['chill', 'study', 'sleep', 'lounge'];
    playlistName = "" + enteredPlaylistName + " playlist - chilled"

  } else if (payload == 'upbeat') {
    selectedGenres = ['club', 'dance', 'disco', 'edm', 'pop'];
    playlistName = "" + enteredPlaylistName + " playlist - upbeat"

  } else if (payload == 'rock') {
    selectedGenres = ['rock', 'hard-rock'];
    playlistName = "" + enteredPlaylistName + " playlist - rock"
  }

  // Create spotify playlist
  spotify.createPlaylist(playlistName, selectedGenres, function (playlistLink) {
    bot.reply(message, "Woof Woof! That's dog for 'your playlist has been built!'");
    bot.reply(message, "Your playlist is here: " + playlistLink);
  });

});


// LOGIN HANDLER
var login_handler = function () {

  mostRecentBotUsed.startConversation(mostRecentMessageReceived, function (err, convo) {

    convo.ask("Great work! Shall we create a playlist now?",
      function (response, convo) {
        convo.next();

        convo.say(response.text);

      });
  });

};

// MESSAGE HANDLER

//this function processes the POST request to the webhook
var handler = function (obj) {
  controller.debug('GOT A MESSAGE HOOK');
  if (obj.entry)
    for (var e = 0; e < obj.entry.length; e++) {
      for (var m = 0; m < obj.entry[e].messaging.length; m++) {
        var facebook_message = obj.entry[e].messaging[m];

        console.log(facebook_message);

        //normal message
        if (facebook_message.message) {

          var message = {
            text: facebook_message.message.text,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp,
            seq: facebook_message.message.seq,
            mid: facebook_message.message.mid,
            attachments: facebook_message.message.attachments
          };

          //save if user comes from m.me adress or Facebook search
          // create_user_if_new(facebook_message.sender.id, facebook_message.timestamp);

          controller.receiveMessage(bot, message);
        }
        //clicks on a postback action in an attachment
        else if (facebook_message.postback) {

          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          var message = {
            payload: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          };

          controller.trigger('facebook_postback', [bot, message]);

          var message = {
            text: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          };

          controller.receiveMessage(bot, message);

        }
        //When a user clicks on "Send to Messenger"
        else if (facebook_message.optin) {

          var message = {
            optin: facebook_message.optin,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          };

          //save if user comes from "Send to Messenger"
          // create_user_if_new(facebook_message.sender.id, facebook_message.timestamp);

          controller.trigger('facebook_optin', [bot, message]);
        }
        //message delivered callback
        else if (facebook_message.delivery) {

          var message = {
            optin: facebook_message.delivery,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          };

          controller.trigger('message_delivered', [bot, message]);

        }
        else {
          controller.log('Got an unexpected message from Facebook: ', facebook_message);
        }
      }
    }
};

exports.handler = handler;
exports.handleSuccessfulLogin = login_handler;
