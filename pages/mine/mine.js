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
    server:"",       //服务器地址
    company:"",      //用户公司
    img1:"/pages/images/about1.png",  
    img2:"/pages/images/right.png",
    id:"",           //名片ID
    image: ['/pages/images/findpeer.png'] //小程序码
  },
  //页面加载
  onLoad:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
    var that=this
    var openid = app.globalData.openid
    that.data.server=app.globalData.server;
    var server = app.globalData.server
    //获取用户个人信息
    util.getMyData(openid).then(function (res) {
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
          userJob:res.userJob,
          company: res.userCompany,
          idustry: res.userIndustry,
          city: res.userCity,
          image: res.userImg,
          id:res.id
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (a) {
    var that = this
    var server = app.globalData.server;
    var openId = app.globalData.openid;
    var otherOpenId = app.globalData.openid;
    var id = that.data.id;
    util.shareToQunOrPersonal(openId, otherOpenId, id).then(function(e){
      console.log(e)
    })
  },
  //点击如何找到
  findUs () {
    wx.navigateTo({
      url: '../findUs/findUs',
    })
  },
 //
  viewImage:function(e){
    // wx.previewImage({
    //   current: '/pages/images/findpeer.png', // 当前显示图片的http链接
    //   urls: image // 需要预览的图片http链接列表
    // })
  }
})