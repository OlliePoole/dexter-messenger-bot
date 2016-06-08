
function createSingleItemAttachment(title, image_url, buttonTitle, web_url) {
  return {
    'type': 'template',
    'payload': {
      'template_type': 'generic',
      'elements': [
        {
          'title': title,
          'image_url': image_url,
          'buttons': [
            {
              'type': 'web_url',
              'url': web_url,
              'title': buttonTitle
            }
          ]
        }
      ]
    }
  };
}

function createGenreSelectionAttachment() {
  return {
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
}

exports.createSingleItemAttachment = createSingleItemAttachment;
exports.createGenreSelectionAttachment = createGenreSelectionAttachment;
