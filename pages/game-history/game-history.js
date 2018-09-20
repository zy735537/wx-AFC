// pages/game-history/game-history.js
import * as echarts from '../../components/ec-canvas/echarts.min';

const globalData = require('../../utils/data.js')
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const api = require('../../utils/webapi.js')

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameId: null,
    personId: null,
    myRank: { IconUrl: iconList.defaultUser },
    ec: { onInit: initChart }
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
});

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: 400
  });
  canvas.setChart(chart);

  var option = {
    title: {      
      show: false
    },
    color: ["#F2F2F2"],
    legend: {
      show: false
    },
    grid: {
      containLabel: false,
      left: 0,
      right: 0
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['', '', '', '', '', '', ''],
      show: false
    },
    yAxis: {
      show: false    
    },
    series: [{
      name: 'A',
      type: 'line',
      // smooth: true,
      data: [18, 36, 65, 30, 178, 140, 33, 65, 38]
    }]
  };

  chart.setOption(option);
  return chart;
}

