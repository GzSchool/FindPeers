// pages/mine/mine.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",         //用户名字
    industry:"",     //用户行业
    city:"",         //用户城市
    userJob:"",      //用户职务
    company:"",      //用户公司
    img1:"/pages/images/about1.png",  
    img2:"/pages/images/right.png",
    id:"",           //名片ID
    image: "/pages/images/findpeer.png",        //小程序码
    QRCode:app.globalData.QRCode,       //小程序二维码
    userImg:"",      //用户头像
  },
  //页面加载
  onLoad:function(){
    this.setData({
      QRCode: app.globalData.QRCode
    })
    console.log(this.data.QRCode)
    wx.showShareMenu({
      withShareTicket: true
    })
    let that=this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          name: res.data.username,
          userJob: res.data.userJob,
          company: res.data.userCompany,
          idustry: res.data.userIndustry,
          city: res.data.userCity,
          userImg: res.data.userImg,
          id: res.data.id
        })
        let userPhotoUrl = res.userImg;
        let page = "pages/peerscards/peerscards";
        let scene = res.id;
        let openid = app.globalData.openid
        util.makeWxQrCode(userPhotoUrl, scene, page, openid).then(function (res) {
          console.log(res)
          app.globalData.QRCode = ("https://www.eqxuan.cn/" + openid + ".png")
        })
      },
      fail: function (res) {
        that.getData()
      }
    })
  },
  getData() {
    let that = this
    let openid = app.globalData.openid
    //获取用户个人信息
    util.getMyData(openid).then(function (res) {
      if (!res) {
        let userPhotoUrl = res.userImg;
        let page = "pages/peerscards/peerscards";
        let scene = res.id;
        util.makeWxQrCode(userPhotoUrl, scene, page, openid).then(function (res) {
          console.log(res)
          app.globalData.QRCode = ("https://www.eqxuan.cn/" + openid + ".png")
        })
        that.setData({
          notadd: true
        })
        app.globalData.notadd = true
      } else {
        app.globalData.notadd = false
        app.globalData.QRCode = ""
        that.setData({
          name: res.username,
          userJob: res.userJob,
          company: res.userCompany,
          idustry: res.userIndustry,
          city: res.userCity,
          userImg: res.userImg,
          id: res.id
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (a) {
    let that = this
    return {
      title: '我的名片信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function (res) {
        let openid = app.globalData.openid;
        let otherOpneId = app.globalData.openid;
        util.shareToQunOrPersonal(openid, otherOpneId ,res).then(function(e){
          console.log(e)
        })
    }
    }
  },
  //点击如何找到
  findUs () {
    wx.navigateTo({
      url: '../findUs/findUs',
    })
  },
 //点击放大预览 再长按可以转发，保存，识别（真机可测）
  viewImage:function(e){           
    var image = this.data.QRCode;
    wx.previewImage({
       current: image, // 当前显示图片的http链接
       urls: [image], // 需要预览的图片http链接列表
       success:function(e){
         console.log(e)
       }
     })
  },
  onShow:function(){
    let that = this
    let userPhotoUrl = that.data.userImg;
    let page = "pages/peerscards/peerscards";
    let scene = that.data.id;
    let openid = app.globalData.openid
    util.makeWxQrCode(userPhotoUrl, scene, page, openid).then(function (res) {
      console.log(res)
      app.globalData.QRCode = ("https://www.eqxuan.cn/" + openid + ".png")
    })
  }
  // scan:function(e){
  //   wx.scanCode({
  //     onlyFromCamera:false,
  //     scanType: ['qrCode'],
  //     success:function(res){
  //       if(res.path){
  //         wx.navigateTo({
  //           url:"/" + res.path,
  //         })
  //       }
  //     }
  //   })
  // }
})