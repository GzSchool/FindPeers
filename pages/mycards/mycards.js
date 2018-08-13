// pages/mycards/mycards.js
var app=getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    mineInfo: {                //缓存  
      name: '',                //用户名字
      idustry: '',             //用户行业
      city: '',                //用户城市
      company: '',             //用户公司
      phone: '',               //用户手机号
      wechatnum: '',           //用户微信号
      email: '',                //用户邮箱
      userJob: ''
    },
    name: "",               //用户名字
    id:"",                  //名片ID
    idustry:"",             //用户行业
    city:"",                //用户城市
    back:"",                //是否返回
    company:"",             //用户公司
    phone: "",              //用户手机号
    server:"",              //服务器地址
    wechatnum: "",          //用户微信号
    email:"",               //用户邮箱
    userJob: '',            //用户职务
    homepage:"www.chaomu.com",            //用户个人主页
    companyWeb:"www.gezhiwenhua.com",          //公司官网   
    groupId:"",             //群组ID
    image:"",               //用户头像
    demand: '',             //需求     
    resources: '',          //资源
    synopsis: '',           //简介
    cardType: 1
    // shareing: false
  },
  //页面加载
  onLoad:function(a){
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(a)
    let that = this
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
          demand: res.data.demand,      //需求
          resources: res.data.resources,//资源
          synopsis: res.data.synopsis,  //简介
          userJob: res.data.userJob,     // 职位
          homepage:res.data.homePage,    //个人主页
          companyWeb:res.data.companyPage, //公司主页
          cardType: res.data.cardType,
          mineInfo: {
            name: res.data.username,
            idustry: res.data.userIndustry,
            city: res.data.userCity,
            company: res.data.userCompany,
            phone: res.data.userPhone,
            wechatnum: res.data.userWechat,
            email: res.data.userEmail,
            userJob: res.data.userJob
          }
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
  //获取用户信息
  getData() {
    let that = this
    let openid = app.globalData.openid;
    util.getMyData(openid).then(function (res) {
      console.log(res)
      if (!res) {
        that.setData({
          notadd: true
        })
        app.globalData.notadd = true
      } else {
        app.globalData.notadd = false
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
          demand: res.demand,      //需求
          resources: res.resources,//资源
          synopsis: res.synopsis,  //简介
          userJob: res.userJob,     // 职位
          homepage: res.homePage,    //个人主页
          companyWeb: res.companyPage, //公司主页
          cardType: res.cardType,
          mineInfo: {
            name: res.username,
            idustry: res.userIndustry,
            city: res.userCity,
            company: res.userCompany,
            phone: res.userPhone,
            wechatnum: res.userWechat,
            email: res.userEmail,
            userJob: res.userJob
          }
        })
      }
    })
  },
  //修改名片
  viewThisCards:function(){
    let openid = app.globalData.openid;
    let groupId= this.data.groupId;
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
  copy:function(e){
    console.log(e)
    var num = e.currentTarget.dataset.num;
    wx.setClipboardData({
      data: num,
      success:function(a){
        app.showToast('复制成功');
        console.log(a)
        wx.getClipboardData({
          success:function(res){
            console.log(res)
          }
        })
      }
    })
  },
  onShow:function(){
    // this.setData({
    //   shareing: false
    // })
  },
  //转发分享
  onShareAppMessage: function (a) {
    let that = this
    return {
      title: '我的名片信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function (res) {
        let openid = app.globalData.openid;
        let otherOpneId = app.globalData.openid;
        let id = that.data.id;
        util.shareToQunOrPersonal(openid, otherOpneId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})