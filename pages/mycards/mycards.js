// pages/mycards/mycards.js
var app=getApp();
var util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js');
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
    homepage:'',            //用户个人主页
    companyWeb: '',          //公司官网   
    groupId:"",             //群组ID
    image:"",               //用户头像
    demand: '',             //需求     
    resources: '',          //资源
    synopsis: '',           //简介
    cardType: 1,
    listOfAlbum: ['https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJF2LUt5pJt4NXyiahzN6UBOTIKmhouTicAOpRe8g87I4r6bx6DyGWkERe2GzhYZR4NBR6u9HxLEdQg/132', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJF2LUt5pJt4NXyiahzN6UBOTIKmhouTicAOpRe8g87I4r6bx6DyGWkERe2GzhYZR4NBR6u9HxLEdQg/132', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJF2LUt5pJt4NXyiahzN6UBOTIKmhouTicAOpRe8g87I4r6bx6DyGWkERe2GzhYZR4NBR6u9HxLEdQg/132', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJF2LUt5pJt4NXyiahzN6UBOTIKmhouTicAOpRe8g87I4r6bx6DyGWkERe2GzhYZR4NBR6u9HxLEdQg/132', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJF2LUt5pJt4NXyiahzN6UBOTIKmhouTicAOpRe8g87I4r6bx6DyGWkERe2GzhYZR4NBR6u9HxLEdQg/132'],
  },
  //页面加载
  onLoad:function(a){
    mta.Page.init();
    console.log('mycard onload')
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(a)
    let that = this
    that.setData({
      id:a.id
    })
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       name: res.data.username,
    //       wechatnum: res.data.userWechat,
    //       company: res.data.userCompany,
    //       idustry: res.data.userIndustry,
    //       city: res.data.userCity,
    //       email: res.data.userEmail,
    //       phone: res.data.userPhone,
    //       image: res.data.userImg,
    //       id: res.data.id,
    //       demand: res.data.demand,      //需求
    //       resources: res.data.resources,//资源
    //       synopsis: res.data.synopsis,  //简介
    //       userJob: res.data.userJob,     // 职位
    //       homepage:res.data.homePage,    //个人主页
    //       companyWeb:res.data.companyPage, //公司主页
    //       cardType: res.data.cardType,
    //       mineInfo: {
    //         name: res.data.username,
    //         idustry: res.data.userIndustry,
    //         city: res.data.userCity,
    //         company: res.data.userCompany,
    //         phone: res.data.userPhone,
    //         wechatnum: res.data.userWechat,
    //         email: res.data.userEmail,
    //         userJob: res.data.userJob
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     that.getData()
    //   }
    // })
    // that.getData()
    // console.log(a.back)
    if(a.back){
      that.data.back = true,
      that.data.groupId = a.groupId
    }
    util.getCardsById(that.data.id).then(function(res){
      console.log(res)
      that.setData({
        mineInfo: {
            name: res.data.data[0].username,
          idustry: res.data.data[0].userIndustry,
          city: res.data.data[0].userCity,
          company: res.data.data[0].userCompany,
          phone: res.data.data[0].userPhone,
          wechatnum: res.data.data[0].userWechat,
          email: res.data.data[0].userEmail,
          userJob: res.data.data[0].userJob
          },
        name: res.data.data[0].username,
        wechatnum: res.data.data[0].userWechat,
        company: res.data.data[0].userCompany,
        idustry: res.data.data[0].userIndustry,
        city: res.data.data[0].userCity,
        email: res.data.data[0].userEmail,
        phone: res.data.data[0].userPhone,
        image: res.data.data[0].userImg,
        id: res.data.data[0].id,
        demand: res.data.data[0].demand,      //需求
        resources: res.data.data[0].resources,//资源
        synopsis: res.data.data[0].synopsis,  //简介
        userJob: res.data.data[0].userJob,     // 职位
        homepage: res.data.data[0].homePage,    //个人主页
        companyWeb: res.data.data[0].companyPage, //公司主页
        cardType: res.data.data[0].cardType,
      })
    })
  },
  //获取用户信息
  // getData() {
  //   let that = this
  //   let openid = app.globalData.openid;
  //   util.getMyData(openid).then(function (res) {
  //     console.log(res)
  //     if (!res) {
  //       that.setData({
  //         notadd: true
  //       })
  //       app.globalData.notadd = true
  //     } else {
  //       app.globalData.notadd = false
  //       that.setData({
  //         name: res.username,
  //         wechatnum: res.userWechat,
  //         company: res.userCompany,
  //         idustry: res.userIndustry,
  //         city: res.userCity,
  //         email: res.userEmail,
  //         phone: res.userPhone,
  //         image: res.userImg,
  //         id: res.id,
  //         demand: res.demand,      //需求
  //         resources: res.resources,//资源
  //         synopsis: res.synopsis,  //简介
  //         userJob: res.userJob,     // 职位
  //         homepage: res.homePage,    //个人主页
  //         companyWeb: res.companyPage, //公司主页
  //         cardType: res.cardType,
  //         mineInfo: {
  //           name: res.username,
  //           idustry: res.userIndustry,
  //           city: res.userCity,
  //           company: res.userCompany,
  //           phone: res.userPhone,
  //           wechatnum: res.userWechat,
  //           email: res.userEmail,
  //           userJob: res.userJob
  //         }
  //       })
  //     }
  //   })
  // },
  //修改名片
  viewThisCards:function(a){
    console.log(a)
    let id = a.currentTarget.dataset.id
    mta.Event.stat("to_fix_page");
    let openid = app.globalData.openid;
    let groupId= this.data.groupId;
    if(this.data.back){
      wx.navigateTo({
        url: '/pages/fix/fix?back=true&groupId=' + groupId + '&id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/fix/fix?id=' + id,
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
        // wx.getClipboardData({
        //   success:function(res){
        //     console.log(res)
        //   }
        // })
      }
    })
  },
  onShow:function(){
  },
  //转发分享
  onShareAppMessage: function (a) {
    let that = this
    console.log('_++++__' + that.data.id)
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
  },
  save(e) {
    mta.Event.stat("mycards_send");
    console.log(e.detail.formId)
    let formId = []
    formId.push(e.detail.formId)
    console.log(formId)
    let openid = app.globalData.openid
    util.userFromId(formId, openid).then(function (res) {
      console.log(res)
    })
  }
})