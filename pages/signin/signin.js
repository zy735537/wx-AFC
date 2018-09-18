// pages/signin/signin.js
const md5 = require('../../utils/md5.js')
const api = require('../../utils/webapi.js')
const session = require('../../utils/session.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "rzhang",
    password: "",
    staySignedIn: true
  },

  formSubmit: function(e) {
    var guid = "2BBE31D7-C9B4-4A21-83E8-85F56E8F8315"
    var username = e.detail.value.username
    var password = e.detail.value.password
    var staySignedIn = e.detail.value.staySignedIn.length > 0
    var hashPassword = md5.hexMD5(guid + password)    

    api.signIn({
      data: {
        username: username,
        passwordhash: hashPassword
      },
      success: function (data) {
        session.signIn(data, staySignedIn)
        wx.reLaunch({
          url: '../index/index',
        })    
      }
    })    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})