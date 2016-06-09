var sentimentAnalysis = require('sentiment-analysis');

function sentimentForMessage(message) {
  return sentimentAnalysis(message);
}

exports.sentimentForMessage = sentimentForMessage;
