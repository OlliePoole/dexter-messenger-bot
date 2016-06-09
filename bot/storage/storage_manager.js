var localStorage   = require('./storage.json');
var storage_access = require('./storage_direct_access');

var user_states = {
  new_user                 : 1, // the user has just started interacting
  existing_without_spotify : 2, // the user has completed the initial interaction, but hasn't signed into Spotify
  existing                 : 3  // the user has completed 1 + 2 and signed into spotify
};

/**
 * Create a new user
 * - Assumes that the user is not already added
 *
 * @param object - An object with a value for the key 'facebook_id'
 */
function createUser(object) {
  var facebookID = object['facebook_id'];

  localStorage.users[facebookID] = {
    'spotify_token' : "",
    'user_state'    : user_states.new_user
  };

  console.log("User created with ID: " + facebookID);

  storage_access.saveJSONFile(localStorage);
}

/**
 * Fetches the current state of a user {1, 2, 3}
 * 
 * @param object - An object containing a value for the key 'facebook_id'
 * @return user_state - an integer in the set {1, 2, 3} representing the current user state
 */
function stateForUser(object) {
  var facebookID = object['facebook_id'];

  return localStorage.users[facebookID]['user_state'];
}


/**
 * Sets the current state for a user
 *
 * @param object - An object containing two keys,
 *                    - 'facebook_id' to identify the user to update
 *                    - 'state' for the new state to set.
 */
function setStateForUser(object) {
  var facebookID = object['facebook_id'];
  var state = object['state'];

  localStorage.users[facebookID]['user_state'] = state;

  storage_access.saveJSONFile(localStorage);
}

createUser({'facebook_id' : '1221'});
console.log("USER STATE: " + stateForUser({'facebook_id' : "1221"}));

function saveSpotifyTokenForUser(object) {
  var facebookID = object['facebook_id'];
  var token = object['spotify_token'];

  localStorage.users[facebookID] = {
    'spotify_token' : token,
    'user_state'    : user_states.existing
  };
}

function loadSpotifyTokenForUser(userID) {
  return "";
}

/**
 * Updates the state of a user in the database
 *
 * The single parameter, an object, must contain values for the keys:
 *  + user      - the user to update
 *  + new_state - the new state to set
 *
 * @param object
 */
function updateUserStateForUser(object) {
  var user = object.user;
  var user_state = object.new_state;
}



// exports.saveToken = saveTokenForUser;
// exports.loadToken = loadTokenForUser;
exports.user_states = user_states;


