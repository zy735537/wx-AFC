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
    pageNum : 1,
    itemsPerPage: globalData.getItemsPerPage(),
    matchList: [],
    myRank: { IconUrl: iconList.defaultUser },    
    ec: { lazyLoad: true }
  },
  loadData: function () {
    this.getPersonRank()
    this.getMatchesByPage()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ gameId: options.gameId, personId: options.personId })     
    this.loadData()
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
    this.loadData()
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

  getMatchesByPage: function () {
    var currentGameId = this.data.gameId
    var currentPersonId = this.data.personId
    var currentPageNum = this.data.pageNum
    if (currentGameId != null && currentPersonId != null) {
      api.getPageMatchesByPerson({
        data: { gameId: currentGameId, personId: currentPersonId, pageNum: currentPageNum, itemsPerPage: this.data.itemsPerPage },
        success: this.loadMatchesByPage
      })
    }
  },
  loadMatchesByPage: function (data) {
    console.log(data)
    var overall = [];
    for (var i = 0; i < data.Items.length; ++i) {
      if (data.Items[i].IconUrl != null) {
        data.Items[i].IconUrl = globalData.getImageFullPath(data.Items[i].IconUrl)
      } else {
        data.Items[i].IconUrl = iconList.defaultUser
      }

      overall.push(data.Items[i].OverallA)
    }

    this.setData({ matchList : data.Items });    
    this.initChart(overall);
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
  },
  initChart: function(data) {      
    this.ecComponent = this.selectComponent('#chart-container');
    this.ecComponent.init((canvas, width, height) => {
      var chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      setOption(chart, data);
      return chart;
    });
  }
});

function setOption(chart, data) {
  var min = 0;
  for (var i = 0; i < data.length; ++i) {
    if (min == 0) {
      min = data[i];
    }
    
    min = Math.min(data[i], min);
  }  

  var option = {
    title: {
      show: false
    },
    color: ['#363636', "#F9B82E"],
    legend: {
      show: false
    },
    grid: {
      containLabel: false,
      x: 30,
      y: 10,
      x2: 10,
      y2: 10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      position: ['50%', 10],  
      // backgroundColor: '#363636',
      textStyle: {
        color: '#F9B82E',
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data,
      show: false
    },
    yAxis: {
      show: false,
      min: min    
    },
    series: [{
      name: '',
      type: 'line',
      //smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      label: {
        color: '#F9B82E',
      },
      lineStyle: {
        width: 1.8,
        // color: '#363636'
      },
      itemStyle: {
        color: '#F9B82E',
      },
      data: data
    }]
  };

  chart.setOption(option);
}

