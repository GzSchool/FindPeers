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
    // 拼接选中行业，给前一个页面data.industry赋值
    let pages = getCurrentPages(),
        currPage = pages[pages.length-1],
        prevPage = pages[pages.length-2]
    prevPage.setData({
      idustry: mes
    })
    wx.navigateBack({})
  }
})