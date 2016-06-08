
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
  }
}

exports.createSingleItemAttachment = createSingleItemAttachment;
