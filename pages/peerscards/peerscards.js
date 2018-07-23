// pages/peerscards/peerscards.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    city: "",
    idustry: "",
    server:"",
    company: "",
    phone: "",
    wechatnum: "",
    image:"/pages/images/1.png",
    email:"",
    isshow:false,
    othercards:'',
    otheropenid:''
  },
  onShareAppMessage:function(){
    var server = that.data.server
    return {
      title: '自定义转发标题',
      path: '/page/peerscards/peerscards?otheropenid='+this.data.otheropenid,
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
  onLoad:function(ops){
    wx.showShareMenu({
      withShareTicket:true
    })
    console.log(ops)
    var that = this
    that.data.server=app.globalData.server
    if (ops.otheropenid != ""){
      that.data.otheropenid = ops.otheropenid
    }
    if(ops.isshow){
      console.log(true)
      that.setData({
        isshow:true
      })
    }else{
      console.log(false)
    }
      
      console.log(that.data.isshow)
      console.log(this.data.isshow)
      var otheropenid = that.data.otheropenid;
    var openid=app.globalData.openid
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server+'/userCard/findOneByOpenId',
      data:{
        openId: otheropenid
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
  addcards:function(){
    var that=this
    var openid = app.globalData.openid;
    var login=app.globalData.login;
    console.log(login)
    if(login){
    var openid = app.globalData.openid
    var otheropenid = that.data.otheropenid
    wx.redirectTo({
      url: '/pages/addcards/addcards?openid='+openid,
      
    })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '需要添加信息请您先授权',
        showCancel: false,
        confirmText: '知道了',
        success:function(a){
          wx.navigateTo({
            url: '/pages/index/index?openid=' + openid+'&other=true',
          })
        }
      })
    }
  },
  setting:function(a){
    var server = that.data.server
    var that=this
    wx.showActionSheet({
      itemList: ["删除同行信息","保存至通讯录"],
      success:function(b){
        if(b.tapIndex==0){
            var otheropenid = this.data.otheropenid
            wx.request({
              method: 'GET',
              url: server+'/userCard/saveOrUpdate',
              data: {
                openId: otheropenid,
                delFlag: 2
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.switchTab({
                  url: '/pages/findmore/findmore',
                })
              }
            })
        }else{
          if (that.data.phone!=null){
            console.log(that.data.phone)
          wx.addPhoneContact({
            firstName: that.data.name,
            mobilePhoneNumber: that.data.phone,
            success:function(a){
              console.log("保存成功")
            }
          })
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '该同行名片手机号为空',
              confirmText: '知道了',
              success: function (res) {
                that.setData({
                  showModal2: false
                });
              }
            })
          }
        }
      },
      fail:function(){

      }
    })
  },
  
  back:function(){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  onShow(){
    this.onLoad()
  }

})