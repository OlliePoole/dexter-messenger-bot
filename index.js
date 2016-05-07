var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var Botkit = require('botkit');
var app = express()

var token = "EAAHELddxja0BAInNz3Kl9X2xTldrxNqKVvsZAiKss1ZB0rch96xPx6r9kJLoMqPUsQyNl1SrZBZCS4aXSi3V8SuZBVq3eGZAqfngLLaxMpWnahyDI2pfTWTbIs7M75fH0sIrK8lZChwMnvtR3CAfpGYczGAKENjuYG7YEKJ06Qx6AZDZD";

app.set('port', (process.env.PORT || 3000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'this_is_my_token') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// // for Facebook verification
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text

            handleIncomingMessage(sender, text);
        }
    }
    res.sendStatus(200)
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

var greetings = ['hello', 'hi']

var humanSpeak = ['human', 'language', 'speak', 'english']

var isFirstLaunch = true

function handleIncomingMessage(sender, message) {

  if (isFirstLaunch) {
    sendTextMessage(sender, "Woof Woof", function() {
      sendTextMessage(sender, "Oh hey there human, my name is Dexter", function() {
        sendTextMessage(sender, "I have four legs, ")
      })
    })
  }

  var splitMessage = message.split(" ")

  if (greetings.indexOf(message.toLowerCase()) != -1) {

    return
  }

  var humanSpeakMessageScore = 0

  splitMessage.forEach(function(word) {
    word = word.toLowerCase()

    if (humanSpeak.indexOf(word) != -1) {
      humanSpeakMessageScore += 1
    }
  })

  if (humanSpeakMessageScore > 0) {
    sendTextMessage(sender, "Wo... Sorry about that human", function() {
      sendTextMessage(sender, "How can I help you today?")
    })



    return
  }



  // send generic response
  sendTextMessage(sender, "Didn't catch that sorry! Was too busy playing fetch")
}

function sendTextMessage(sender, text, completion) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else if (completion !== undefined) {
          completion()
        }
    })
}
