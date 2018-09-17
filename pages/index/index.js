//index.js
//获取应用实例
const app = getApp()
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const api = require('../../utils/webapi.js')
const auth = require('../../utils/authentication.js')

Page({
  data: {      
    rankList: [],
    myRank: { IconUrl: iconList.defaultUser},
    currentGame: { "GameId": 7, "Name": "Foosball Season 6", "Type": 1, "Create_Time": "\/Date(1533036461000)\/", "begin_date": 1533081600000, "end_date": 1538351940000, "Active": true, "Icon": "/AFC/images/foosball.jpg", "Deleted": false }
  },
  //事件处理函数
  signInHandler: function() {
    wx.navigateTo({
      url: '../signin/signin'
    })
  },
  playerItemTab: function (event) {
    var gameId = event.currentTarget.dataset.gameId
    var personId = event.currentTarget.dataset.personId

    wx.navigateTo({
      url: '../game-history/game-history?gameId=' + gameId + "&personId=" + personId
    })
  },

  onPullDownRefresh: function() {    
    wx.stopPullDownRefresh()
    this.getRankList(this.loadRankList)    
  },
  onLoad: function () {        
    this.setData({ iconList: iconList });
    this.getRankList(this.loadRankList)          
    this.setData({ 'currentGame.begin_date': util.formatTime(new Date(this.data.currentGame.begin_date))})
    this.setData({ 'currentGame.end_date': util.formatTime(new Date(this.data.currentGame.end_date)) })
  },
  onShow: function() {
    this.setData({ isAuthenticated: auth.isAuthenticated() });
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
    api.getRankList({ 
      data: {gameId: 7},       
      success: callback
    })
  }
})
