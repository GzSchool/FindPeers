// pages/quncards/quncards.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qunname: "格致文化",
    nonum: 0,
    num: 1,
    time: "2018/7/16",
    list: [],
    server:"",
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (a) {
    var that = this;
    that.data.server=app.globalData.server;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var openid = app.globalData.openid;
    var groupid = app.globalData.groupid;
    var list = that.data.list;
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server+'/userGroup/findGroupCards',
      data: {
        openId: "333",
        groupId: "1",
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        for (var i = 0; i < 3; i++) {
          list.push(b.data.data[i]);
        }
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        });
      }
    })
  }
})