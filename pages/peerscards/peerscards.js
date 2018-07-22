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
    return {
      title: '自定义转发标题',
      path: '/page/peerscards/peerscards',
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
    
    if (ops.otheropenid != ""){
      that.data.otheropenid = ops.otheropenid
    }
    that.otheropenid=app.globalData.otheropenid;
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
      var otheropenid = app.globalData.otheropenid
    var openid=app.globalData.openid
    wx.request({
      method: 'GET',
      url: 'http://localhost:8080/userCard/findOneByOpenId',
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
    var login=app.globalData.login;
    console.log(login)
    if(login){
    var openid = app.globalData.openid
    var otheropenid=app.globalData.otheropenid
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
            url: '/pages/index/index?openid=' + openid+'&other=true'+'other=true',
          })
        }
      })
    }
  },
  setting:function(a){
    var that=this
    wx.showActionSheet({
      itemList: ["转发","保存至通讯录"],
      success:function(b){
        if(b.tapIndex==0){
          
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
  remove:function(){
    var id=this.data.id
    wx.request({
      method: 'GET',
      url: '',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){

      }
    })
  }

})