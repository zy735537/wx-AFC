module.exports = {
  getAuthKey: getAuthKey,
  getAPIUrl: getAPIUrl,
  getImageFullPath: getImageFullPath,
  getData: getData,
  setData: setData,
  removeData: removeData
}

function getAPIUrl(relativePath) {
  return "https://www.activesports.top/AFC-Api/v1" + relativePath
}

function getImageFullPath(relativePath) {
  return 'https://www.activesports.top/' + relativePath;
}

function getAuthKey() {
  return "key-authentication";
}

function getData(key) {
  return wx.getStorageSync(key)
}

function setData(key, data) {
  return wx.setStorageSync(key, data)
}

function removeData(key) {
  return wx.removeStorageSync(key)
}