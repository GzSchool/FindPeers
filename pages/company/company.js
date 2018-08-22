// pages/company/company.js
var util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js');
var app = getApp()
Page({
  data: {
  },
  onLoad: function (ops) {
    mta.Page.init();
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
  },
  //联系客服
  save(e) {
    mta.Event.stat("contact_us");
    console.log(e.detail.formId)
    let formId = []
    formId.push(e.detail.formId)
    console.log(formId)
    let openid = app.globalData.openid
    util.userFromId(formId, openid).then(function (res) {
      console.log(res)
    })
  }
})