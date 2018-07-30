// pages/mine/mine.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    industry:"",
    city:"",
    server:"",
    company:"",
    img1:"/pages/images/about1.png",
    img2:"/pages/images/right.png"
  },
  onLoad:function(){
    
    var that=this
    var openid = app.globalData.openid
    that.data.server=app.globalData.server;
    var server = that.data.server
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
          emai: res.userEmail,
          phone: res.userPhone,
          image: res.userImg,
        })
      }
    })
  },
  
  onShareAppMessage: function (a) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log("2222222222222333333333333333") 
    return{
      title: '自定义转发标题',
      path: '/page/mine/mine?otheropenid='+this.data.openid,
      success: function (res) {
        console.log("66666666666") 
        console.log(res)
        console.log(a)        
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
              success:function(c){
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
  findUs () {
    wx.navigateTo({
      url: '../findUs/findUs',
    })
  }
})