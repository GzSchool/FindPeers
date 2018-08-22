// pages/mine/mine.js
var app = getApp();
var util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js');
Page({
  data: {
    cd_list: [5,5,3,2,2],
    indicatorDots: true,
    autoplay: false,
    interval: 2500,
    duration: 800,
    name: "", //用户名字
    industry: "", //用户行业
    city: "", //用户城市
    userJob: "", //用户职务
    company: "", //用户公司
    img1: "/pages/images/about1.png",
    img2: "/pages/images/right.png",
    id: "", //名片ID
    image: "/pages/images/findpeer.png", //小程序码
    QRCode: "", //小程序二维码
    userImg: "", //用户头像
    cardNumber: '',
    cardList: [],
    num: 1,
  },
  //页面加载
  onLoad: function() {
    mta.Page.init();
    if (app.globalData.QRCode) {
      this.setData({
        QRCode: app.globalData.QRCode
      })
    }
    console.log(this.data.QRCode)
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this
    let openid = app.globalData.openid
    util.getMyDataList(openid).then(function(res){
      console.log(res.data.data)
      if(res.data.data){
        var cd_list = []
        for (var i = 0; i < res.data.data.length; i++) {
          cd_list.push(res.data.data[i].cardType)
        }
        that.setData({
          cardList:res.data.data,
          cardNumber:res.data.data.length,
          cd_list:cd_list
        })
      }
    })
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function(res) {
    //     that.setData({
    //       name: res.data.username,
    //       userJob: res.data.userJob,
    //       company: res.data.userCompany,
    //       idustry: res.data.userIndustry,
    //       city: res.data.userCity,
    //       userImg: res.data.userImg,
    //       id: res.data.id
    //     })
    //   },
    //   fail: function(res) {
    //     that.getData()
    //   }
    // })
  },
  getData() {
    let that = this
    let openid = app.globalData.openid
    //获取用户个人信息
    util.getMyDataList(openid).then(function(res) {
      if (!res.data.data) {
        that.setData({
          notadd: true
        })
        app.globalData.notadd = true
      } else {
        app.globalData.notadd = false
        that.setData({
          name: res.data.data[0].username,
          userJob: res.data.data[0].userJob,
          company: res.data.data[0].userCompany,
          idustry: res.data.data[0].userIndustry,
          city: res.data.data[0].userCity,
          userImg: res.data.data[0].userImg,
          id: res.data.data[0].id
        })
      }
    })
  },
  //分享
  onShareAppMessage: function(a) {
    let that = this
    return {
      title: '我的名片信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function(res) {
        let openid = app.globalData.openid;
        let otherOpneId = app.globalData.openid;
        util.shareToQunOrPersonal(openid, otherOpneId, res).then(function(e) {
          console.log(e)
        })
      }
    }
  },
  //点击如何找到
  findUs() {
    wx.navigateTo({
      url: '../findUs/findUs',
    })
  },
  //点击放大预览 再长按可以转发，保存，识别（真机可测）
  viewImage: function(e) {
    var image = e.currentTarget.dataset.num
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: [image], // 需要预览的图片http链接列表
      success: function(e) {
        console.log(e)
      }
    })
  },
  onShow: function() {
  },
  save(e) {
    console.log(e.detail.formId)
    let formId = []
    formId.push(e.detail.formId)
    console.log(formId)
    let openid = app.globalData.openid
    util.userFromId(formId, openid).then(function(res) {
      console.log(res)
    })
  },
  ganerate:function(a){
    let id=this.data.id
    wx.navigateTo({
      url: '../ganerate/ganerate?id=' + id,
    })
  }
})