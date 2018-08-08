// pages/industry/industry.js
const app = getApp()
Page({
  data: {
    active: 0, // 当前选中
    industry: app.globalData.industry, // 行业数据
  },
  onLoad: function (options) {
  },
  // 选中父行业
  chooseParent (e) {
    this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  // 选中子行业
  chooseItem (e) {
    let i = this.data.active
    let j = e.currentTarget.dataset.index
    let mes =this.data.industry[i].data[j]
    let pages = getCurrentPages(),
        currPage = pages[pages.length-1],
        prevPage = pages[pages.length-2]
    prevPage.setData({
      idustry: mes
    })
    wx.navigateBack({})
  },
  onShareAppMessage: function (a) {
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
  },
})