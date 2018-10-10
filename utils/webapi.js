module.exports = {
  signIn: signIn,
  getRankList: getRankList,
  getPersonRank: getPersonRank,
  getPageMatchesByPerson: getPageMatchesByPerson,
  confirmMatch: confirmMatch,
  removeMatch: removeMatch
}

const data = require('data.js')
const loading = require('loading.js')
const session = require('session.js')

var log2Console = true;

const defaultOptions = {
  method: "GET",
  header: {
    'content-type': 'application/json' // 默认值
  }
}

// options: { 
//   data: { username: '', passwordhash: ''},
//   success: function (res) { ... } 
// }
function signIn(options) {
  options.url = data.getAPIUrl('/Account/Login')
  options.method = "POST"
  call(options)
}

// options: { 
//   data: { personId: 1},
//   success: function (res) { ... } 
// }
function getPersonProfile(options) {
  options.url = data.getAPIUrl('/Game/GetPersonProfile')
  call(options)
}

// options: { 
//   data: { gameId: 7}, 
//   success: function (res) { ... } 
// }
function getRankList(options) {
  options.url = data.getAPIUrl('/Game/GetPersonalRankinglist')
  call(options)
}

// options: { 
//   data: { gameId: 7, personId: 1 }, 
//   success: function (res) { ... } 
// }
function getPersonRank(options) {
  options.url = data.getAPIUrl('/Game/GetPersonalRankinglist')
  var callback = options.success
  options.success = function (data) {
    var personRank;
    for (var i = 0; i < data.length; i++) {
      if (data[i].PersonId == options.data.personId) {
        personRank = data[i]
      }      
    }

    if (callback != null) {
      callback(personRank)
    }    
  }

  call(options)
}

// options: { 
//   data: { gameId: 7, personId: 1, pageNum = 1, itemsPerPage = 20 },
//   success: function (res) { ... },
//   loading: { title: 'loading...' }
// }
function getPageMatchesByPerson(options) {
  options.url = data.getAPIUrl('/Game/GetPageMatchsByPerson2');    
  call(options)
}

// options: { 
//   data: { matchId: 7 },
//   success: function (res) { ... },
//   loading: { title: 'loading...' }
// }
function confirmMatch(options) {
  options.url = data.getAPIUrl('/Game/ConfirmMatch');
  options.header = {
    'content-type': 'application/json',
    'Authorization': "Basic " + session.getToken()
  };
    
  call(options)
}

// options: { 
//   data: { matchId: 7 },
//   success: function (res) { ... },
//   loading: { title: 'loading...' }
// }
function removeMatch(options) {
  options.url = data.getAPIUrl('/Game/RemoveMatch');
  options.header = {
    'content-type': 'application/json',
    'Authorization': "Basic " + session.getToken()
  };

  call(options)
}

function call(options) {
  loading.show(options.loading);

  wx.request({
    url: options.url,
    data: options.data,
    method: options.method == null ? defaultOptions.method : options.method,
    header: options.header == null ? defaultOptions.header : options.header,
    success: function (res) {
      // if (options.success != null) {
      //   options.success(res.data)
      // }
      
      // if (log2Console) {
      //   console.log(res.data)
      // }      
    },
    fail: function (e) {
      if (log2Console) {
        console.log(res.data)
      }

      if (options.fail != null) {
        options.fail(e)
      } else {
        loading.showError(e)
      }      
    },
    complete: function (e) {
      if (options.complete != null) {
        options.complete(e)
      }
      
      if (e.statusCode != 200) {
        loading.hide(function () {
          if (e.statusCode == 401) {
            wx.navigateTo({
              url: '../signin/signin'
            });
          } else {
            loading.showError(e.data.Message);
          }                    
        })
      } else {
        if (options.success != null) {
          options.success(e.data)
        }
                
        loading.hide()
      }

      if (log2Console) {
        console.log('Call completed: ' + options.url)
      }      
    }
  })
}