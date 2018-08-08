// pages/company/company.js
var app = getApp()
Page({
  data: {
  },
  onLoad: function (ops) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //联系客服
  touch: function(e) {
    console.log(e)
    var that = this
    that.data.server = app.globalData.server;
  },
  //转发分享
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
        console.log(res)
        // 转发失败
      }
    }
  }
})