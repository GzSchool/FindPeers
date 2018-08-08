// pages/findUs/findUs.js
Page({
  data: {
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShareAppMessage: function (a) {               //转发
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
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
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  }
})