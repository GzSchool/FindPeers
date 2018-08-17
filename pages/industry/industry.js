// pages/industry/industry.js
const app = getApp()
var mta = require('../../utils/mta_analysis.js');
var util = require('../../utils/util.js');
Page({
  data: {
    active: 0, // 当前选中
    industry: app.globalData.industry, // 行业数据
  },
  onLoad: function (options) {
    mta.Page.init();
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
  },
})