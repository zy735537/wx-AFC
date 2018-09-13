var count = 0;

function show() {
  count++
  if (count == 1) {           
    wx.showLoading({title: "loading", mask: false})
  }    
}

function hide() {
  if (count > 0) {
    count--
  }  

  if (count == 0) {
    wx.hideLoading()
  }
}

module.exports = {
  show: show,
  hide: hide
}
