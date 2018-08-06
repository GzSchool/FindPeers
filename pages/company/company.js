// pages/company/company.js
var app = getApp()
Page({
  data: {
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
  touch: function(e) {
    console.log(e)
    var that = this
    that.data.server = app.globalData.server;
  },
  onLoad:function(ops){
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})