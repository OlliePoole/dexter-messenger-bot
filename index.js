
var token = "EAAHELddxja0BAInNz3Kl9X2xTldrxNqKVvsZAiKss1ZB0rch96xPx6r9kJLoMqPUsQyNl1SrZBZCS4aXSi3V8SuZBVq3eGZAqfngLLaxMpWnahyDI2pfTWTbIs7M75fH0sIrK8lZChwMnvtR3CAfpGYczGAKENjuYG7YEKJ06Qx6AZDZD";
var access = "this_is_my_token"

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.facebookbot({
    debug: true,
    access_token: token,
    verify_token: access,
});

var bot = controller.spawn({
});


controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});


controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

  bot.startConversation(message,function(err,convo) {

    convo.say('Woof Woof');
    convo.say('Oh hey there human, my name is Dexter');
    convo.say('I have four legs, lots of fur and can help you discover new and great music');

    convo.ask("I don't think we've met before, and I can't smell you from here. So can you tell me your name?", function(response,convo) {

      convo.say('Nice to meet you ' + response.text);
      convo.next();
    });
  });
});


/// Create playlists
controller.hears(['I have an exam next week, can you create a (.*) playlist'],  'message_received', function(bot, message) {
  var playlistName = message.match[1];

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
                      'payload':'upbeat'
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
                      'payload':'rock'
                      }
                  ]
              },
          ]
      }
  };
  bot.reply(message, "What sort of playlist would you like?");
  bot.reply(message, {
      attachment: playlistGenreAttachment,
  });
});

controller.on('facebook_postback', function(bot, message) {

  var selectedGenre = message.payload;

  // Create spotify playlist

});
