// pages/findUs/findUs.js
Page({
  data: {
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //转发分享
  onShareAppMessage: function (a) {               
    var that = this
    return {
      title: '名片Live',
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