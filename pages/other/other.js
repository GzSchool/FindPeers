// pages/mycards/mycards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    adress: "",
    idustry: "",
    company: "",
    phone: "",
    wechatnum: "",
    emai: "",
    image: "",
    showphone: false,
    showdemand: false,
    showresource: false,
    showintroduction: false
  },
  onLoad: function (a) {
    var that = this
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    var otheropenid=app.globalData.openid;
    console.log(openid)
    wx.request({
      method: 'GET',
      url: 'http://localhost:8080/userCard/findOneByOpenId',
      data: {
        openId: otheropenid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        that.setData({
          name: b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          emai: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
        })
      }
    })
  },
  toMyPeers: function () {
    var openid = app.globalData.openid;
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  viewThisCards: function () {
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/viewThis/viewThis?openid=' + openid,
    })
  }


})