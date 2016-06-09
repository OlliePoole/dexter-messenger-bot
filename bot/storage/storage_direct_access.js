var jsonfile = require('jsonfile');

exports.saveJSONFile = function(json) {
  var file = './storage.json';

  jsonfile.writeFile(file, localStorage, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("JSON file saved successfully");
    }
  });
};