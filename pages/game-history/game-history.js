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
    this.initChart();
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

    this.setData({ matchList : data.Items }) 
    
    // this.chart.setOption({
    //   series: [{        
    //     data: overall
    //   }]
    // });
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
  initChart: function() {
    this.ecComponent = this.selectComponent('#chart-container');
    this.ecComponent.init((canvas, width, height) => {
      var chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      setOption(chart);
      this.chart = chart;
      return chart;
    });
  }
});

function setOption(chart) {
  var option = {
    title: {
      show: false
    },
    color: ["#F9B82E"],
    legend: {
      show: false
    },
    grid: {
      containLabel: false,
      // left: 0,
      // right: 0,
      x: 10,
      y: 10,
      x2: 10,
      y2: 0
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      show: false
    },
    yAxis: {
      show: false
    },
    series: [{
      name: '',
      type: 'line',
      //smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 1.8,
      },
      data: [12, 34, 656, 5]
    }]
  };

  chart.setOption(option);
}

// function initChart(canvas, width, height) {
//   var chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);

//   var option = {
//     title: {      
//       show: false
//     },
//     color: ["#F9B82E"],
//     legend: {
//       show: false
//     },
//     grid: {
//       containLabel: false,
//       // left: 0,
//       // right: 0,
//       x: 10,
//       y: 10,
//       x2: 10,
//       y2: 0      
//     },
//     tooltip: {
//       show: true,
//       trigger: 'axis'
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: [],
//       show: false
//     },
//     yAxis: {
//       show: false    
//     },
//     series: [{
//       name: '',
//       type: 'line',
//       //smooth: true,
//       symbol: 'circle',
//       symbolSize: 6,
//       lineStyle: {
//         width: 1.8,
//       },      
//       data: []
//     }]
//   };

//   chart.setOption(option);
//   this.chart = chart;
//   return chart;
// }

