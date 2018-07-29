// pages/industry/industry.js
const app = getApp()
Page({
  data: {
    industry: app.industry,
    active: '0'
  },
  onLoad: function (options) {
  },
  chooseParent (e) {
    this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  chooseItem (e) {
    let i = this.data.active
    let j = e.currentTarget.dataset.index
    let mes = this.data.industry[i].value + "/" + this.data.industry[i].data[j]
    console.log(mes)
    let pages = getCurrentPages(),
        currPage = pages[pages.length-1],
        prevPage = pages[pages.length-2]
    prevPage.setData({
      idustry: mes
    })
    wx.navigateBack({})
  }
})