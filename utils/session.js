module.exports = {
  init: init,
  signIn: signIn,
  signOut: signOut,
  isAuthenticated: isAuthenticated,
  getToken: getToken,
  getPersonId: getPersonId,
  isStaySignedIn: isStaySignedIn,
  getGameId: getGameId,
  setGameId: setGameId
}

const data = require('data.js')

var _authkey = data.getAuthKey()
var _authData = null
var _currentGameId = null

function init() {
  var gameKey = data.getCurrentGameKey()
  _authData = data.getData(_authkey)  
  _currentGameId = data.getData(gameKey)  
}

function signIn(authData, staySignedIn) {
  _authData = authData;
  if (staySignedIn) {
    _authData.staySignedIn = true
  } else {
    _authData.staySignedIn = false
  }

  data.setData(_authkey, _authData)
}

function signOut() {
  _authData = null
  data.removeData(_authkey)
}

function isAuthenticated() {
  return _authData != null  
}

function isStaySignedIn() {
  if (_authData == null) {
    return null    
  } else {
    return _authData.staySignedIn
  }
}

function getToken() {  
  if (_authData == null) {
    return null
  } else {
    return _authData.AccessToken
  }
}

function getPersonId() {
  if (_authData == null) {
    return null
  } else {
    return _authData.PersonId
  }
}

function getGameId() {
  if (_currentGameId != null && _currentGameId != '')
    return _currentGameId

  if (_authData != null) {
    return _authData.DefaultGameId    
  }

  return null
}

function setGameId(currentGameId) {
  _currentGameId = currentGameId
  var gameKey = data.getCurrentGameKey()
  data.setData(gameKey, _currentGameId)
}