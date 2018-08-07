// pages/mine/mine.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vals: 'asd',
    name:"",
    industry:"",
    city:"",
    userJob:"",
    server:"",
    company:"",
    img1:"/pages/images/about1.png",
    img2:"/pages/images/right.png",
    id:"",
    image: ['/pages/images/findpeer.png']
  },
  onLoad:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
    var that=this
    var openid = app.globalData.openid
    console.log(openid)
    that.data.server=app.globalData.server;
    var server = app.globalData.server
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
          userJob:res.userJob,
          company: res.userCompany,
          idustry: res.userIndustry,
          city: res.userCity,
          emai: res.userEmail,
          phone: res.userPhone,
          image: res.userImg,
          id:res.id
        })
      }
    })
  },
  onShareAppMessage: function (a) {
    var that = this
    var server = app.globalData.server
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log("2222222222222333333333333333") 
    return{
      title: '我的同行信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function (res) {
        console.log(that.data.id)         
        console.log("66666666666") 
        console.log(res)
        console.log(a)        
        var shareTickets = res.shareTickets;
        console.log(shareTickets)
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (b) {
            console.log(app.globalData.openid,)
            console.log(app.globalData.openid)
            console.log(b)                        
            var encryptedData = b.encryptedData;
            var iv = b.iv;
            console.log(encryptedData)
            console.log(iv)
            wx.request({
              method: 'POST',
              url: server+'/userGroup/saveOrUpdate',

              data: {
                openId:app.globalData.openid,
                otherOpenId: app.globalData.openid,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success:function(c){
                console.log(c)
                // wx.navigateTo({
                //   url: '/pages/mine/mine',
                // })
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
  },
  viewImage:function(e){
    // wx.previewImage({
    //   current: '/pages/images/findpeer.png', // 当前显示图片的http链接
    //   urls: image // 需要预览的图片http链接列表
    // })
  }
})