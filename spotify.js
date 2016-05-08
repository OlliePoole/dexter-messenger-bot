var request = require('request')
var config = require('./config')

function createPlaylist(name, genres, completion) {
  console.log("Creating Playlist");
  createEmptyPlaylist(name, function(playListID) {

    console.log("Fetching seed tracks");
    fetchSeedTracks(genres, function(tracks) {

      console.log("Filling playlist");
      fillPlaylist(playListID, tracks, function() {
        completion();
      });
    });

  });
}

// Creates the empty playlist
function createEmptyPlaylist(playlistName, completion) {

  //Lets configure and request
  request({
      url: 'https://api.spotify.com/v1/users/0llie99/playlists', //URL to hit
      method: 'POST', //Specify the method
      json: {
        "name": playlistName,
        "public": false
      }, //Query string data
      headers: { //We can define headers too
          'Content-Type': 'application/json',
          'Authorization': config.spotify_token
      }
  }, function(error, response, body){
      if(error) {
          console.log(error);
      } else {

        if (response.statusCode == 200 || response.statusCode == 201) {
          console.log("Playlist created");
          var playlistID = body.id
          completion(playlistID);
        }
        else {
          console.log("HTTP Code: " + response.statusCode);
          console.log(body);
        }
      }
  });
}

// Fills the playlist using the seed tracks
function fillPlaylist(playlistToFill, seedTracks, completion) {
  fetchTracksForPlaylist(seedTracks, function(tracksToAdd) {

    //Lets configure and request
    request({
        url: 'https://api.spotify.com/v1/users/0llie99/playlists/' + playlistToFill + '/tracks?uris=' + tracksToAdd.join(), //URL to hit
        method: 'POST', //Specify the method
        headers: { //We can define headers too
            'Content-Type': 'application/json',
            'Authorization': config.spotify_token
        }

    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {

          if (response.statusCode == 200 || response.statusCode == 201) {
            console.log("Tracks added");
            completion();
          }
          else {
            console.log("HTTP Code: " + response.statusCode);
            console.log(body);
          }
        }
    });
  });
}

function fetchTracksForPlaylist(seedTracks, completion) {
  var tracksToAdd = [];

  console.log(seedTracks.join());
  //Lets configure and request
  request({
      url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + seedTracks.join(), //URL to hit
      method: 'GET', //Specify the method
      headers: { //We can define headers too
          'Authorization': config.spotify_token
      }
  }, function(error, response, body){
      if(error) {
          console.log(error);
      } else {

        // convert body to JSON
        var stringBody = response.toString();
        var json = JSON.parse(body);

        if (json.tracks.length > 0) {
          json.tracks.forEach(function(item) {
            tracksToAdd.push(item.uri);
          });
        }

        completion(tracksToAdd);
      }
  });
}

var fiveSongsFound = false;
// Fetchs the 5 seed tracks required to create the new playlist
function fetchSeedTracks(searchGenres, completion) {

  //Lets configure and request
  request({
      url: 'https://api.spotify.com/v1/me/top/artists?limit=100', //URL to hit
      method: 'GET', //Specify the method
      headers: { //We can define headers too
          'Accept': 'application/json',
          'Authorization': config.spotify_token
      }
  }, function(error, response, body){
      if(error) {
          console.log(error);

      } else {

        // convert body to JSON
        var stringBody = response.toString();
        var json = JSON.parse(body);

        if (json.items.length > 0) {
          var foundSongs = [];

          // for each track in the user's top 100 tracks.
          json.items.forEach(function(item) {
            var genres = item.genres

            // check if the track's genres match any of the search genres
            if (genres.length > 0) {
              genres.forEach(function(genre) {
                if (searchGenres.indexOf(genre) != -1) {
                  foundSongs.push(item.id);
                }
              });
            }

            // if we have 5 matching tracks, stop looking
            if (foundSongs.length == 5 && fiveSongsFound == false) {
              fiveSongsFound = true;

              console.log("Five songs found");
              completion(foundSongs);
              return;
            }
          });
          if (!fiveSongsFound) {
            console.log("Songs found" + foundSongs.length);
            completion(foundSongs);
            return;
          }
        }
      }
  });
}

exports.createPlaylist = createPlaylist;
