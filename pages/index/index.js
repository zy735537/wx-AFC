//index.js
//获取应用实例
const app = getApp()
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const loading = require('../../utils/loading.js')

Page({
  data: {  
    rankList: [],
    currentGame: { "GameId": 7, "Name": "Foosball Season 6", "Type": 1, "Create_Time": "\/Date(1533036461000)\/", "begin_date": 1533081600000, "end_date": 1538351940000, "Active": false, "Icon": "/AFC/images/foosball.jpg", "Deleted": false }
  },
  //事件处理函数
  bindViewTap: function() {    
    wx.navigateTo({
      url: '../signin/signin'
    })
  },

  onPullDownRefresh: function() {    
    wx.stopPullDownRefresh()
    this.getRankList(this.loadRankList)    
  },
  onLoad: function () {        
    this.getRankList(this.loadRankList)      
    this.setData({ iconList: iconList });
    this.setData({ 'currentGame.begin_date': util.formatTime(new Date(this.data.currentGame.begin_date))})
    this.setData({ 'currentGame.end_date': util.formatTime(new Date(this.data.currentGame.end_date)) })
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
    loading.show();
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
      complete: function(e) {
        loading.hide();
      }
    })
  }
})
