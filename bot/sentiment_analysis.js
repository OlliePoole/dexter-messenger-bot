var sentimentAnalysis = require('sentiment-analysis');

function sentimentForMessage(message) {
  var sentiment = sentimentAnalysis(message);

  return sentiment;
}

exports.sentimentForMessage = sentimentForMessage
