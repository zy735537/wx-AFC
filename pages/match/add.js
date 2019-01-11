// pages/match/add.js

const globalData = require('../../utils/data.js')
const api = require('../../utils/webapi.js')
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const loading = require('../../utils/loading.js')

Page({

  /**
   * Page initial data
   */
  data: {
    placeholder: { PersonId: -1, Icon: iconList.defaultUser, Badge: "?" },
    maxScore: 10,

    scoreList: [],
    playerList: [],    
    scoreA: null,
    scoreB: null,
    playerA: null,
    playerA2: null,
    playerB: null,
    playerB2: null,
    isGroup: false,  // true - double; false - single
    isValid: false 
  },

  validateInput: function() {
    var is_Group = false;
    var score_A = this.data.scoreA;
    var score_B = this.data.scoreB;    
    var is_Valid = score_A != null && score_B != null;    
    var player_A = this.data.playerA;
    var player_A2 = this.data.playerA2;
    var player_B = this.data.playerB;
    var player_B2 = this.data.playerB2;
    if (player_A != null && player_A2 != null && player_B != null && player_B2 != null) {
      is_Group = true;
    } else {
      if (player_A == null && player_A2 != null) {
        player_A = player_A2;
        player_A2 = null;
      }

      if (player_B == null && player_B2 != null) {
        player_B = player_B2;
        player_B2 = null;
      }

      is_Valid = is_Valid && (player_A != null && player_B != null);
      is_Valid = is_Valid && ((player_A2 == null && player_B2 == null) || (player_A2 != null && player_B2 != null));
    }    

    this.setData({ isGroup: is_Group, isValid: is_Valid, playerA: player_A, playerA2: player_A2, playerB: player_B, playerB2: player_B2 });
  },

  resetSelection: function() {
    this.setData({
      scoreList: [],
      playerList: [],      
      scoreA: null,
      scoreB: null,
      playerA: null,
      playerA2: null,
      playerB: null,
      playerB2: null      
    });    
  },

  getAllPersons: function () {        
    api.getAllPersons({
      data: { },
      success: this.loadAllPersons
    });    
  },

  loadAllPersons: function (data) {
    wx.stopPullDownRefresh();
    console.info(data);
    if (data != null) {
      var pList = [];
      for (var i = 0; i < data.length; ++i) {
        if (data[i].Icon != null) {
          data[i].Icon = globalData.getImageFullPath(data[i].Icon)
        } else {
          data[i].Icon = iconList.defaultUser
        }

        data[i].Badge = util.getBadge(data[i].FirstName, data[i].LastName);        
        data[i].selected = false;
        data[i].FullName = data[i].FirstName + ' ' + data[i].LastName;

        if (data[i].PersonId != 0) {
          pList.push(data[i]);
        }        
      }
      
      this.setData({
        playerList: pList
      });
    }
  },  

  addHandler: function(event) {
    loading.showError("Hi, match adding");
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
        if (this.data.playerB2 == null) {
          this.setData({
            playerA2: this.data.playerB,
            playerB: player
          });
        } else {
          this.setData({
            playerA2: player            
          });
        }
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

    this.validateInput();    
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
    this.validateInput();
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
    this.resetSelection();
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