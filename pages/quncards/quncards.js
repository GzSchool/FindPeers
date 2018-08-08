   // pages/quncards/quncards.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    list: [],
    imgList: []
  },
  //页面加载
  onLoad: function (a) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    var openid = app.globalData.openid;
    var list = that.data.list;
    list=[];
    util.getUserGroupById(openid).then(function (res) {
      var len = res.data.data.length;
      for (var i = 0; i < len; i++) {
        // 处理时间截取字母T之前的年月日
        res.data.data[i].ctTime = res.data.data[i].ctTime.split('T')[0];
        list.push(res.data.data[i]);
      }
      that.setData({
        list: list
      });
    })
  },
  //点击群
  search: function (a) {
    var openid = a.currentTarget.dataset.id;
    var groupid = a.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupid,
    })
  },
  //页面刷新
  onShow: function () {
    this.onLoad();
  },
  //转发
  onShareAppMessage: function (a) {
    var that = this
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})