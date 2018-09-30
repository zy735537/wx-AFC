const util = require('util.js')

var count = 0;

const defaultOptions = { title: "loading", mask: false };

/*
options: { title: 'data loading...' }
*/
function show(options) {
  count++
  if (count == 1) {      
    var option = util.extend(defaultOptions, options);
    wx.showLoading(option);
  }
}

function hide(completeHandler) {
  if (count > 0) {
    count--
  }  

  if (count == 0) {
    setTimeout(function() {
      wx.hideLoading({
        complete: completeHandler
      })
    }, 500)
  }
}

function showError(message) {
  wx.showToast({
    title: 'ERROR\r\n' + message,
    icon: 'none',
    duration: 3000
  })
}

module.exports = {
  show: show,
  hide: hide,
  showError: showError
}
