   // pages/quncards/quncards.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    list: [],
    imgList: []
  },
  //转发
  onShareAppMessage: function (a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function (res) {
        console.log("66666666666")
        console.log(res)
        console.log(a)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)
            console.log(a)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',

              data: {
                openId: app.globalData.openId,
                otherOpenId: app.globalData.openId,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                // wx.navigateTo({
                //   url: '/pages/peerscards/peerscards',
                // })
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
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
  }
})