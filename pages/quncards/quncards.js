   // pages/quncards/quncards.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    list: []
  },
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
  onLoad: function (a) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log('load')
    var that = this;
    // that.setData({
    //   list: []
    // })
    var openid = app.globalData.openid;
    var groupid = app.globalData.groupid;
    var list = that.data.list;
    list=[];
    console.log(openid)
    util.getUserGroupById(openid).then(function (res) {
      console.log(res)
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
    console.log(a)
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