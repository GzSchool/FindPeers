// pages/peerscards/peerscards.js
var util = require('../../utils/util.js');
var app=getApp();
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
    cardId:[],
    phone: "",
    wechatnum: "",
    image:"/pages/images/1.png",
    email:"",
    isshow:false,
    othercards:'',
    chooseSize: false,
    animationData: {},
    isgroup:""
  },
  onShareAppMessage:function(){
    var server = that.data.server
    var that=this
    return {
      title: '自定义转发标题',
      path: '/page/peerscards/peerscards?othercardid='+that.data.cardId,
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
  onLoad:function(ops){
    wx.showShareMenu({
      withShareTicket:true
    })
    console.log(ops)
    var that = this
    that.data.server=app.globalData.server
    that.data.isgroup=app.globalData.isgroup;
    that.setData({
      isshow: app.globalData.isshow
    })
    console.log(app.globalData.isshow)
    console.log(app.globalData.notadd)    
    var openid=app.globalData.openid
    var server = that.data.server
    var othercardid=app.globalData.othercardid;
    that.cardId.push(othercardid)
    util.getCardsById(othercardid).then(function (res) {
      that.setData({
        name: res.data.data[0].username,
        wechatnum: res.data.data[0].userWechat,
        company: res.data.data[0].userCompany,
        idustry: res.data.data[0].userIndustry,
        city: res.data.data[0].userCity,
        email: res.data.data[0].userEmail,
        phone: res.data.data[0].userPhone,
        image: res.data.data[0].userImg,
      })
    })
  },
  addcards:function(e){
    var that=this
    var openid = app.globalData.openid;
    var isshow=app.globalData.isshow;
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }
  },
  remove:function(){
    var that=this
    var server = app.globalData.server;
    var othercardid=app.globalData.othercardid;
    var openid=app.globalData.openid;
    var cardId=that.data.cardId
    util.saveOrUpdate(openid, groupId, 2, cardId).then(function (res) {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  back:function(){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  chooseSize:function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 400,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  saveToPhone:function(){
    var that=this
    if (that.data.phone !== null) {
      console.log(that.data.phone)
      wx.addPhoneContact({
        firstName: that.data.name,
        mobilePhoneNumber: that.data.phone,
        success: function (a) {
          that.hideModal();
          console.log("保存成功")
          wx.switchTab({
            url: '/pages/findmore/findmore',
          })
        },fail:function(p){
          console.log(p)
          that.hideModal();
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '该同行名片手机号为空',
        confirmText: '知道了',
        success: function (res) {
          that.hideModal();
          that.setData({
            showModal2: false
          });
        },fail:function(p){
          console.log(p)
          that.hideModal();
        }
      })
    }
  },
  save:function(){
    var that=this
    var server=app.globalData.server;
    var openid=app.globalData.openid;
    var othercardid=app.globalData.othercardid
    var cardId=that.data.cardId
    console.log(cardId)
    util.saveOrUpdate(openid, groupId, 2, cardId).then(function (res) {
      wx.navigateBack({
        delta: 1
      })
    })
  },
  backToFind:function(){
    this.hideModal()
    // wx.switchTab({
    //   url: '/pages/findmore/findmore',
    // })
  },
  toTeamPeers:function(){
    var groupId=app.globalData.groupid;
    var openid=app.globalData.openid;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid='+openid+'&groupid='+groupId,
    })
  },
  onShow(){
    this.onLoad()
  }

})