module.exports = {
  getAuthKey: getAuthKey,
  getCurrentGameKey: getCurrentGameKey,
  getAPIUrl: getAPIUrl,
  getImageFullPath: getImageFullPath,
  getItemsPerPage: getItemsPerPage,
  getData: getData,
  setData: setData,
  removeData: removeData
}

const iconList = require('icons.js')

function getAPIUrl(relativePath) {
  return "https://www.activesports.top/AFC-Api/v1" + relativePath;
  //return "https://www.activesports.top/API-TEST/v1" + relativePath;
}

function getImageFullPath(relativePath) {
  if (relativePath == null || relativePath == '') {
    return iconList.defaultUser;
  }

  return 'https://www.activesports.top/' + relativePath;
}

function getItemsPerPage() {
  return 20;
}

function getAuthKey() {
  return "key-authentication";
}

function getCurrentGameKey() {
  return "key-CurrentGame";
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