// pages/mycards/mycards.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    name: "",
    id:"",
    adress: "",
    idustry:"",
    city:"",
    back:"",
    company:"",
    phone: "",
    server:"",
    wechatnum: "",
    email:"",
    userJob: '',
    groupId:"",
    image:"",
    demand: '',//需求
    resources: '',//资源
    synopsis: '',//简介
    showphone:false,
    showdemand:false,
    showresource:false,
    showintroduction:false,
    // shareing: false
  },
  onLoad:function(a){
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(a)
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          name: res.data.username,
          wechatnum: res.data.userWechat,
          company: res.data.userCompany,
          idustry: res.data.userIndustry,
          city: res.data.userCity,
          email: res.data.userEmail,
          phone: res.data.userPhone,
          image: res.data.userImg,
          id: res.data.id,
          demand: res.data.demand,//需求
          resources: res.data.resources,//资源
          synopsis: res.data.synopsis,//简介
          userJob: res.data.userJob // 职位
        })
      },
      fail: function (res) {
        that.getData()
      }
    })
    console.log(a.back)
    if(a.back){
      that.data.back = true,
      that.data.groupId = a.groupId
    }
    
  },
  getData() {
    let that = this
    var openid = app.globalData.openid;
    util.getMyData(openid).then(function (res) {
      console.log(res)
      if (!res) {
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
          id: res.id,
          demand: res.demand,//需求
          resources: res.resources,//资源
          synopsis: res.synopsis,//简介
          userJob: res.userJob // 职位
        })
      }
    })
  },
  onShareAppMessage: function (a) {
    console.log("2222222222222333333333333333")
    var that=this
    var server = app.globalData.server;
    return {
      title: '我的名片信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function (res) {
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
              success: function (c) {
                console.log(c)
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  viewThisCards:function(){
    var openid = app.globalData.openid;
    var groupId= this.data.groupId;
    if(this.data.back){
      wx.navigateTo({
        url: '/pages/fix/fix?back=true&groupId=' + groupId + '&openid=' + openid,
      })
    }else{
      wx.navigateTo({
        url: '/pages/fix/fix',
      })
    }
  },
  goFindmore:function(a){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  toMyPeers () {
    // console.log('分享')
    // this.setData({
    //   shareing: true
    // })
  },
  onShow:function(){
    // this.setData({
    //   shareing: false
    // })
  }
})