// pages/game-history/game-history.js
import * as echarts from '../../components/ec-canvas/echarts.min';

const globalData = require('../../utils/data.js')
const iconList = require('../../utils/icons.js')
const util = require('../../utils/util.js')
const api = require('../../utils/webapi.js')
const session = require('../../utils/session.js')
const loading = require('../../utils/loading.js')

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameId: null,
    personId: null,
    pageNum : 0,
    totalPage: null,
    itemsPerPage: globalData.getItemsPerPage(),    
    groupedMatchList: [],
    overall: [],
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
    this.setData({ gameId: options.gameId, personId: options.personId });
    this.loadData();
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
    this.setData({ groupedMatchList: [], overall: [], pageNum: 0, totalPage: null }); // Init data
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
    var currentPage = this.data.pageNum;
    if (currentPage < this.data.totalPage) {      
      this.getMatchesByPage();
    }    
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
      var fetchPagenum = currentPageNum + 1; 
      var loadingTitle = "loading (" + fetchPagenum + "/" + this.data.totalPage + ")";
      api.getPageMatchesByPerson({
        data: { gameId: currentGameId, personId: currentPersonId, pageNum: fetchPagenum, itemsPerPage: this.data.itemsPerPage },
        success: this.loadMatchesByPage,
        loading: { title: loadingTitle }
      })
    }
  },
  loadMatchesByPage: function (data) {
    //console.log(data);
    var addToGroupedMatchList = function (groupedList, item){
      var group;
      if (group == null) {
        for (var i = 0; i < groupedList.length; ++i) {
          if (groupedList[i].name == item.groupBy) {
            group = groupedList[i];
            break;
          }
        }

        if (group == null) {
          group = { name: item.groupBy, items: [] };
          groupedList.push(group);
        }
      }

      group.items.push(item);
    };

    var currentPersonId = session.getPersonId();
    for (var i = 0; i < data.Items.length; ++i) {
      data.Items[i].PersonAIcon = globalData.getImageFullPath(data.Items[i].PersonAIcon);
      data.Items[i].PersonA2Icon = globalData.getImageFullPath(data.Items[i].PersonA2Icon);
      data.Items[i].PersonBIcon = globalData.getImageFullPath(data.Items[i].PersonBIcon);
      data.Items[i].PersonB2Icon = globalData.getImageFullPath(data.Items[i].PersonB2Icon);

      data.Items[i].CanBeRemoved = data.Items[i].CanBeRemovedBy.indexOf(currentPersonId) >= 0;
      data.Items[i].CanBeConfirmed = data.Items[i].CanBeConfirmedBy.indexOf(currentPersonId) >= 0;
      data.Items[i].groupBy = util.formatTime(new Date(data.Items[i].Date));
      addToGroupedMatchList(this.data.groupedMatchList, data.Items[i]);

      if (data.Items[i].OverallA > 0) {
        this.data.overall.push(data.Items[i].OverallA);
      }      
    }

    var overallList =  util.cloneArray(this.data.overall);    
    this.setData({ groupedMatchList: this.data.groupedMatchList, pageNum: data.CurrentPage, totalPage: data.TotalPage });
    console.log(this.data);
    this.initChart(overallList.reverse());
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
  },
  removeHandler: function (event) {
    var matchId = event.currentTarget.id;
    var matchRemovedUpdate = this.matchRemovedUpdate;    
    wx.showModal({
      title: 'Confirmation',
      content: 'Remove this match. Are you sure?',
      success: function(res) {
        if (res.confirm) {
          api.removeMatch({
            data: { matchId: matchId },
            success: function () {
              matchRemovedUpdate(matchId);
            }
          });
        }        
      }
    });
  },
  confirmHandler: function (event) {
    var matchId = event.currentTarget.id;
    var matchConfirmedUpdate = this.matchConfirmedUpdate;
    wx.showModal({
      title: 'Confirmation',
      content: 'To confirm this match. Are you sure?',
      success: function (res) {
        if (res.confirm) {
          api.confirmMatch({
            data: { matchId: matchId },
            success: function () {
              matchConfirmedUpdate(matchId);
            }
          });
        }  
      }
    });
  },
  matchRemovedUpdate: function (matchId) {
    var groupedList = this.data.groupedMatchList;
    var removed = false;
    for (var i = 0; i < groupedList.length; ++i) {
      if (removed)
        break;

      var group = groupedList[i];
      for (var j = 0; j < group.items.length; ++j) {
        if (matchId == group.items[j].MatchId) {                                         
          group.items.splice(j, 1);          
          removed = true;
          break;
        }        
      };
    };
     
    this.setData({ groupedMatchList: groupedList });
  },
  matchConfirmedUpdate: function (matchId) {
    var groupedList = this.data.groupedMatchList;
    var updated = false;
    for (var i = 0; i < groupedList.length; ++i) {
      if (updated)
        break;

      var group = groupedList[i];
      for (var j = 0; j < group.items.length; ++j) {
        if (matchId == group.items[j].MatchId) {
          group.items[j].HasConfirmed = true;
          group.items[j].CanBeConfirmed = false;          
          updated = true;
          break;
        }
      };
    };

    this.setData({ groupedMatchList: groupedList });
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
      x2: 30,
      y2: 20      
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

