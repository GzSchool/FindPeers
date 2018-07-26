// pages/mycards/mycards.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    adress: "",
    idustry:"",
    city:"",
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
    var openid = app.globalData.openid;
    var server = app.globalData.server;
    wx.request({
      method: 'GET',
      url: server+'/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(b){
        console.log(b)
        that.setData({
          name: b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          email: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
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
                console.log(c)
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
      url: '/pages/fix/fix',
    })
  },
  goFindmore:function(a){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  }

 
})