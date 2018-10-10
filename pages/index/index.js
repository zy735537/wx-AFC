//index.js
//获取应用实例
const app = getApp()
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const api = require('../../utils/webapi.js')
const session = require('../../utils/session.js')
const globalData = require('../../utils/data.js')

Page({
  data: {    
    rankList: [],
    myRank: { IconUrl: iconList.defaultUser },
    currentGame: { "GameId": 10, "Name": "Season Oct-Nov", "Type": 1, "Create_Time": "\/Date(1533036461000)\/", "begin_date": 1533081600000, "end_date": 1538351939999, "Active": true, "Icon": "/AFC/images/foosball.jpg", "Deleted": false }
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
    this.getRankList()
    this.getPersonRank()
  },
  onLoad: function () {        
    this.setData({ iconList: iconList });
    this.setData({ 'currentGame.begin_date': util.formatTime(new Date(this.data.currentGame.begin_date)) })
    this.setData({ 'currentGame.end_date': util.formatTime(new Date(this.data.currentGame.end_date)) })

    this.getRankList()
    this.getPersonRank()
  },
  onShow: function() {
    this.setData({ isAuthenticated: session.isAuthenticated() });
    this.setData({ currentPersonId: session.getPersonId() });
  },
  loadRankList: function (data) {
    for (var i = 0; i < data.length; ++i) {    
      if (data[i].IconUrl != null) {
        data[i].IconUrl = globalData.getImageFullPath(data[i].IconUrl)
      } else {
        data[i].IconUrl = iconList.defaultUser
      }

      data[i].Me = data[i].PersonId == this.data.currentPersonId           
    }
    
    this.setData({
      rankList: data
    })    
  },
  getRankList: function () {
    api.getRankList({ 
      data: {gameId: 10},       
      success: this.loadRankList
    })
  },
  getPersonRank: function () {
    var currentGameId = session.getGameId()
    var currentPersonId = session.getPersonId()
    if (currentGameId != null && currentPersonId != null) {
      api.getPersonRank({
        data: { gameId: currentGameId, personId: currentPersonId },
        success: this.loadPersonRank
      })
    }
  },
  loadPersonRank: function (data) {
    if (data != null) {
      if (data.IconUrl != null) {
        data.IconUrl = globalData.getImageFullPath(data.IconUrl)
      } else {
        data.IconUrl = iconList.defaultUser
      }            

      data.rankSuffix = util.getNumberSuffix(data.Rank)
      this.setData({
            myRank: data
          }) 
    }    
  }
})
