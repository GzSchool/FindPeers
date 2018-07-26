// pages/mine/mine.js
var app=getApp();
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
    img2:"/pages/images/about2.png"
  },
  onLoad:function(){
    
    var that=this
    var openid = app.globalData.openid
    that.data.server=app.globalData.server;
    var server = that.data.server
    wx.login({
      success:function(a){
        if(a.code){
          var code=a.code
          wx.request({
            method: 'GET',
            url: server +'/user/userAuthor',

            data: {
              code:a.code
            },

            header: {
              'content-type': 'application/json'
            },
            success:function(b){
              var openid=b.data.data.openId;
              var openid=app.globalData.openid;
              wx.request({
                method: 'GET',
                url: server+'/userCard/findOneByOpenId',

                data: {
                  openId:openid
                },

                header: {
                  'content-type': 'application/json'
                },
                success:function(c){
                  that.setData({
                    name: c.data.data.username,
                    wechatnum: c.data.data.userWechat,
                    company: c.data.data.userCompany,
                    industry: c.data.data.userIndustry,
                    city: c.data.data.userCity,
                    email: c.data.data.userEmail,
                    phone: c.data.data.userPhone,
                    image: c.data.data.userImg,
                  })
                }
              })
            }
          })
        }
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
  }
})