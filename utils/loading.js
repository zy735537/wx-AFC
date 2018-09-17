var count = 0;

function show() {
  count++
  if (count == 1) {           
    wx.showLoading({title: "loading", mask: false})
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
    title: 'Error: ' + message,
    icon: 'none',
    duration: 3000
  })
}

module.exports = {
  show: show,
  hide: hide,
  showError: showError
}
