// pages/game-history/game-history.js
const globalData = require('../../utils/data.js')
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const api = require('../../utils/webapi.js')
var wxCharts = require('../../utils/wx-charts.js');

var app = getApp();
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameId: null,
    personId: null,
    myRank: { IconUrl: iconList.defaultUser }
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }, 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ gameId: options.gameId, personId: options.personId }) 
    this.getPersonRank()

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      console.log(windowWidth);
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['1', '2', '3'],
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: [18, 12, 23, 123, 23, 78, 356, 56],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });    
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
    this.getPersonRank()
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

  },

  getPersonRank: function () {
    var currentGameId = this.data.gameId
    var currentPersonId = this.data.personId
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