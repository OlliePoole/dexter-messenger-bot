
function createSingleItemAttachment(title, image_url, buttonTitle, buttonPayload) {
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
              'type': 'postback',
              'title': buttonTitle,
              'payload': buttonPayload
            }
          ]
        }
      ]
    }
  }
}

exports.createSingleItemAttachment = createSingleItemAttachment;
