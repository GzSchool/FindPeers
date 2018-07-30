// pages/mycards/mycards.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    name: "",
    adress: "",
    idustry:"",
    city:"",
    back:"",
    company:"",
    phone: "",
    server:"",
    wechatnum: "",
    email:"",
    image:"/pages/images/1.png",
    showphone:false,
    showdemand:false,
    showresource:false,
    showintroduction:false
  },
  onLoad:function(a){
    wx.showShareMenu({
      withShareTicket: true
    })
    var that=this
    if(a.back){
      that.data.back=true
    }
    var openid = app.globalData.openid;
    var server = app.globalData.server;
    util.getMyData(openid).then(function (res) {
      console.log(res)
      if (res == null) {
        that.setData({
          notadd: true
        })
        app.globalData.notadd = true
      } else {
        app.globalData.notadd = false
        app.globalData.isshow = true
        that.setData({
          name: res.username,
          wechatnum: res.userWechat,
          company: res.userCompany,
          idustry: res.userIndustry,
          city: res.userCity,
          email: res.userEmail,
          phone: res.userPhone,
          image: res.userImg,
        })
      }
    })
  },
  onShareAppMessage: function (a) {
    console.log("2222222222222333333333333333")
    var that=this
    var server = that.data.server
    return {
      title: '自定义转发标题',
      path: '/page/mine/mine',
      success: function (res) {
        console.log("66666666666")
        wx.switchTab({
          url: '/pages/findmore/findmore',
        })
        console.log(res)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)
            console.log(a)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'GET',
              url: server+'/userGroup/saveOrUpdate',

              data: {
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                wx.switchTab({
                  url: '/pages/findmore/findmore',
                })
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  },
  viewThisCards:function(){
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/fix/fix?back=true',
    })
  },
  goFindmore:function(a){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  }

 
})