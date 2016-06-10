var jsonfile = require('jsonfile');

exports.saveJSONFile = function(json, callback) {
  var file = './storage.json';

  jsonfile.writeFile(file, json, {spaces: 2}, function (err) {
    if (err) {
      console.error(err);
      callback("Save unsuccessful");
    } else {
      console.log("JSON file saved successfully");
      callback("Save successful");
    }
  });
};