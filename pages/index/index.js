//index.js
//获取应用实例
const app = getApp()
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')

Page({
  data: {  
    rankList: [],
    currentGame: { "GameId": 7, "Name": "Foosball Season 6", "Type": 1, "Create_Time": "\/Date(1533036461000)\/", "begin_date": 1533081600000, "end_date": 1538351940000, "Active": true, "Icon": "/AFC/images/foosball.jpg", "Deleted": false }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onPullDownRefresh: function() {
    this.getRankList(this.loadRankList)
  },
  onLoad: function () {    
    this.getRankList(this.loadRankList)

    this.setData({ iconList: iconList });
    this.setData({ 'currentGame.begin_date': util.formatTime(new Date(this.data.currentGame.begin_date))});
    this.setData({ 'currentGame.end_date': util.formatTime(new Date(this.data.currentGame.end_date)) });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getMyInfo: function (callback){
    wx.request({
      url: 'https://www.activesports.top/AFC-Api/v1/Game/GetPersonProfile',
      data: {
        personId: 1        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {        
        callback(res)

        console.log(res.data)
      }
    })  
  },
  loadRankList: function (res) {
    for (var i = 0; i < res.data.length; ++i) {    
      if (res.data[i].IconUrl != null) {
        res.data[i].IconUrl = util.fillImagePath(res.data[i].IconUrl)
      } else {
        res.data[i].IconUrl = iconList.defaultUser
      }
    }

    this.setData({
      rankList: res.data
    })    
  },
  getRankList: function (callback) {
    wx.request({
      url: 'https://www.activesports.top/AFC-Api/v1/Game/GetPersonalRankinglist',
      data: {
        gameId: 7
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        callback(res)

        console.log(res.data)
      },
      complete: function(e){
        wx.stopPullDownRefresh()
      }
    })
  }
})
