// pages/match/add.js

const globalData = require('../../utils/data.js')
const api = require('../../utils/webapi.js')
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')

Page({

  /**
   * Page initial data
   */
  data: {
    scoreList: [],
    playerList: [],
    maxScore: 10,
    scoreA: null,
    scoreB: null,
    playerA: null,
    playerA2: null,
    playerB: null,
    playerB2: null
  },

  getAllPersons: function () {        
    api.getAllPersons({
      data: { },
      success: this.loadAllPersons
    });    
  },

  loadAllPersons: function (data) {
    if (data != null) {
      for (var i = 0; i < data.length; ++i) {
        if (data[i].Icon != null) {
          data[i].Icon = globalData.getImageFullPath(data[i].Icon)
        } else {
          data[i].Icon = iconList.defaultUser
        }

        data[i].Badge = util.getBadge(data[i].FirstName, data[i].LastName);        
        data[i].selected = false;
      }
      
      this.setData({
        playerList: data
      });
    }
  },  

  playerTab: function (event) {    
    var IdSelected = event.currentTarget.dataset.personId;
    var playerlist = this.data.playerList;
    var player = this.getPlayerById(IdSelected);
    if (player == null) {
      return;
    }

    if (player.selected) {
      player.selected = false;
      if (this.data.playerA != null && this.data.playerA.PersonId == player.PersonId) {        
        this.setData({
          playerA: null
        });
      } else if (this.data.playerB != null && this.data.playerB.PersonId == player.PersonId) {        
        this.setData({
          playerB: null
        });
      } else if (this.data.playerA2 != null && this.data.playerA2.PersonId == player.PersonId) {
        this.setData({
          playerA2: null
        });
      } else if (this.data.playerB2 != null && this.data.playerB2.PersonId == player.PersonId) {
        this.setData({
          playerB2: null
        });
      }
    } else {
      if (this.data.playerA == null) {     
        player.selected = true;   
        this.setData({
          playerA: player
        });
      } else if (this.data.playerB == null) {
        player.selected = true;
        this.setData({
          playerB: player
        });       
      } else if (this.data.playerA2 == null) {
        player.selected = true;
        this.setData({
          playerA2: player
        });
      } else if (this.data.playerB2 == null) {
        player.selected = true;
        this.setData({
          playerB2: player
        });
      }
    }

    this.setData({
      playerList: playerlist
    });    
  },

  scroeTab: function (event) {    
    var scoreSelected = event.currentTarget.dataset.score;        
    var a = this.data.scoreA;
    var b = this.data.scoreB;
    if (scoreSelected == a) {
      a = null;
    } else if (scoreSelected == b) {
      b = null;
    } else if (a == null) {
      a = scoreSelected;
    } else if (b == null) {
      b = scoreSelected;
    }  

    this.setData({ scoreA: a, scoreB: b });        
    this.refreshScoreList();
  },

  getPlayerById: function(id) {
    var list = this.data.playerList;
    for (var i = 0; i < list.length; i++) {
      if (list[i].PersonId == id) {
        return list[i];
      }
    }    

    return null;
  },

  refreshScoreList: function() {
    var list = this.data.scoreList;    
    for (var i = 0; i <= this.data.maxScore; i++) {
      list[i] = { score: i, selected: i == this.data.scoreA || i == this.data.scoreB };
    }

    this.setData({ scoreList: list });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {     
    this.getAllPersons();
    this.refreshScoreList();  
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.onLoad({});
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})