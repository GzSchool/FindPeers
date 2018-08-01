   // pages/quncards/quncards.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    list: []
  },
  onLoad: function (a) {
    console.log('load')
    var that = this;
    // that.setData({
    //   list: []
    // })
    var openid = app.globalData.openid;
    var groupid = app.globalData.groupid;
    var list = that.data.list;
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
  search: function (a) {
    var openid = a.currentTarget.dataset.id;
    var groupid = a.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupid,
    })
  },
  onShow: function () {
    this.onLoad();
  }
})