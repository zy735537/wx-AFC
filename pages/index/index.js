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
    gameList: [],
    myRank: { IconUrl: iconList.defaultUser },    
    currentGame: { "GameId": null, "Name": "Loading", "Type": 1 }
  },
  //事件处理函数
  signInHandler: function() {
    wx.navigateTo({
      url: '../signin/signin'
    })
  },
  formatDate: function(date) {
    if (date == null)
      return null;

    return util.formatTime(new Date(date));
  },
  gamePickerChange: function(e) {
    var selectedGame = this.data.gameList[e.detail.value];
    this.setData({ currentGame: selectedGame });   
    session.setGameId(selectedGame.GameId);    
    this.loadAllData();
  },
  playerItemTab: function (event) {
    var gameId = event.currentTarget.dataset.gameId
    var personId = event.currentTarget.dataset.personId

    wx.navigateTo({
      url: '../game-history/game-history?gameId=' + gameId + "&personId=" + personId
    })
  },
  onPullDownRefresh: function() {    
    wx.stopPullDownRefresh();
    this.loadAllData();
  },
  onLoad: function () {   
    //this.showFooter();
    this.setData({ iconList: iconList });
    var currentGameId = session.getGameId();
    if (currentGameId == null) {
      this.getDefaultGame();
    } else {      
      this.loadAllData();
    }    

    //wx.showTabBar();
  },
  onShow: function() {
    this.setData({ isAuthenticated: session.isAuthenticated() });
    this.setData({ currentPersonId: session.getPersonId() });
  },
  loadAllData: function () {
    this.getGameList();
    this.getRankList();
    this.getPersonRank();    
  },
  loadDefaultGame: function (data) {
    console.log(data);
    if (data != null) {
      session.setGameId(data.Id);
      this.loadAllData();
    } else {

    }
  },
  getDefaultGame: function () {
    api.getDefaultGame({
      success: this.loadDefaultGame
    })
  },    
  loadGameList: function (data) {    
    var activeGames = [];
    var curGame = null;
    for (var i = 0; i < data.length; i++) {      
      data[i].begin_date = this.formatDate(data[i].begin_date);
      data[i].end_date = this.formatDate(data[i].end_date);      
      if (data[i].Active) {                   
        activeGames.push(data[i]);
      }

      if (data[i].GameId == session.getGameId()) {
        curGame = data[i];
      }
    } 
    
    this.setData({
      gameList: activeGames,
      currentGame: curGame
    })
  },
  getGameList: function () {
    api.getAllGames({      
      success: this.loadGameList
    })
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
    console.log(data);
    this.setData({
      rankList: data
    })    
  },
  getRankList: function () {
    api.getRankList({ 
      data: { gameId: session.getGameId()},       
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
