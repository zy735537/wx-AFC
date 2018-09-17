module.exports = {
  init: init,
  signIn: signIn,
  signOut: signOut,
  isAuthenticated: isAuthenticated,
  getToken: getToken,
  getPersonId: getPersonId,
  isStaySignedIn: isStaySignedIn
}

const data = require('data.js')

var _authkey = data.getAuthKey()
var _authData = null

function init() {
  _authData = data.getData(_authkey)
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
  // var authData = data.getData(authkey)
  // return authData != null && authData != ''
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