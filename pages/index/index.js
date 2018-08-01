var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    // userInfo: {},
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // openid: "",
    // server: "",
    // isshow: "",
    // other: ''
  },
  onLoad: function(ops) {
    // wx.switchTab({
    //   url: '../otherpeers/otherpeers',
    // })
    // wx.navigateTo({
    // url: '../inputSearch/inputSearch',
    // url: '../company/company',
    // url: '../first/first'
    // })
    // var that = this
    // that.data.server = app.globalData.server;
    // that.data.othercardid = app.globalData.othercardid;
    // that.data.openid = app.globalData.openid;
    // console.log(that.data.openid)
  },
  bindGetUserInfo: function(e) {
    // var that = this;
    // var server = that.data.server
    // if (e.detail.userInfo) {
    //   console.log('000')
    //   //用户按了允许授权按钮
    //   if (that.data.othercardid) {
    //     var othercardid = app.globalData.othercardid;
    //     var openid = that.data.openid;
    //     console.log(othercardid)
    //     if (othercardid) {
    //       wx.redirectTo({
    //         url: '/pages/addcards/addcards?othercardid=' + othercardid,
    //       })
    //     } else {
    //       wx.redirectTo({
    //         url: '/pages/addcards/addcards?openid=' + openid,
    //       })
    //     }
    //   }
    // } else {
    //   var othercardid = app.globalData.othercardid;
    //   console.log(othercardid)
    //   if (othercardid) {
    //     wx.redirectTo({
    //       url: '/pages/peerscards/peerscards?othercardid=' + othercardid,
    //     })
    //   } else {
    //     wx.switchTab({
    //       url: '/pages/findmore/findmore',
    //     })
    //   }
    // }
  }
})