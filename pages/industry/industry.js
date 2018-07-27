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
    console.log(app)
    console.log(this)
    let i = this.data.active
    let j = e.currentTarget.dataset.index
    console.log(this.data.industry[i].value + "\\" + this.data.industry[i].data[j])
    // wx.navigateTo({
    //   url: '',
    // })
  }
})