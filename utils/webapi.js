module.exports = {
  signIn: signIn,
  getRankList: getRankList  
}

const data = require('data.js')
const loading = require('loading.js')

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

function call(options) {
  loading.show();

  wx.request({
    url: options.url,
    data: options.data,
    method: options.method == null ? defaultOptions.method : options.method,
    header: options.header == null ? defaultOptions.header : options.header,
    success: function (res) {
      if (options.success != null) {
        options.success(res)
      }
      
      if (log2Console) {
        console.log(res.data)
      }      
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
          loading.showError(e.data.Message)
        })
      } else {
        loading.hide()
      }

      if (log2Console) {
        console.log('Call completed: ' + options.url)
      }      
    }
  })
}