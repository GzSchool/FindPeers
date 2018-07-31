// pages/addCards/addcards.js
import { validateEmail, isvalidatemobile } from '../../utils/validate.js'
var app = getApp();
Page({
  data: {
    count: 0,        //简介字数
    openid: "",      //用户标识
    othercardid:"",  //分享的人的标识
    groupId:"",      //群id
    userId: 0,       //用户id
    name: "",        //用户名字
    other: '',                                                      
    wechatnum: "",    //用户填写的微信号
    image:"",         //用户的微信头像
    company: "",      //用户填写的公司名称
    idustry: "",      //用户选择的行业
    job:'',           //用户填写的职务 
    city: "",         //用户填写的城市
    phone: "",        //用户手机号
    server:"",        //服务器地址
    demand: "",       //用户填写的需求
    introduction: "", //用户简介
    resource: "",     //用户资源
    email: "",        //用户邮箱
    back:"",          //是否返回
    isshow:'',        //是否显示
    isshow0: false,   //需求是否显示
    isshow1: false,   //资源是否显示
    isshow2: false,   //邮箱是否显示
    itemList: ["需求", "资源", "邮箱"]  // 添加更多项
  },
  onLoad: function (res) {
    var that = this
    that.data.server = app.globalData.server;
    that.data.openid = app.globalData.openid;
    that.data.isshow = app.globalData.isshow;
    that.data.othercardid = app.globalData.othercardid;
    var openid = that.data.openid;
    var isshow = that.data.isshow;
    if (res.back) {
      that.setData({
        back: true,
        openid: res.openid,
        groupId: res.groupId,
      })
    } else {
      that.setData({
        back: false,
        openid: res.openid,
        groupId: res.groupId,
      })
    }
    console.log(openid)
    console.log(that.data.groupId)
    wx.getUserInfo({
      success: function (a) {
        that.setData({
          image: a.userInfo.avatarUrl
        })
      }
    })
  },
  // 用户点击添加更多
  addmore: function () {                                                
    var that = this
    wx.showActionSheet({
      itemList: ["需求", "资源", "邮箱"],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.setData({
            isshow0: true
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            isshow1: true
          })
        } else {
          that.setData({
            isshow2: true
          })
        }
      }
    })
  },
  addname: function (e) {
    if (e.detail.value == '') {
      wx.getUserInfo({
        success: function (a) {
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl
          })
        }
      })
    } else {
      this.data.name = e.detail.value
    }
  },
  addnumber: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
    } else {
      this.data.wechatnum = e.detail.value
    }
  },
  addcompany: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none'
      })
    } else {
      this.data.company = e.detail.value
    }
  },
  addidustry: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '行业信息不能为空',
        icon: 'none'
      })
    } else {
      this.data.idustry = e.detail.value
    }
  },
  addcity: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '城市信息不能为空',
        icon: 'none'
      })
    } else {
      this.data.city = e.detail.value
    }
  },
  addjob: function (e) {
    this.data.job = e.detail.value
  },
  addphone: function (e) {
    this.data.phone = e.detail.value
  },
  adddemand: function (e) {
    this.data.demand = e.detail.value
  },
  addresource: function (e) {
    this.data.resource = e.detail.value
  },
  addemail: function (e) {
    this.data.email = e.detail.value
  },
  introInput(e) {
    this.data.introduction = e.detail.value
    let i = e.detail.value.length
    this.setData({
      count: i
    })
  },
  // 用户点击保存
  save: function (e) {                                                              
    var that = this
    var othercardid = app.globalData.othercardid
    var server = this.data.server
    var back = false;
    if (this.data.back == "") {
      back = false
    } else {
      back = this.data.back
    }
    if (isvalidatemobile(this.data.phone)[0]) {
      wx.showToast({
        title: isvalidatemobile(this.data.phone)[1],
        icon: 'none'
      })
    } else if (!validateEmail(this.data.email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      })
    } else if (this.data.wechatnum == "") {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
    } else if (this.data.company == "") {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none'
      })
    } else if (this.data.idustry == "") {
      wx.showToast({
        title: '行业信息不能为空',
        icon: 'none'
      })
    } else if (this.data.city == "") {
      wx.showToast({
        title: '城市信息不能为空',
        icon: 'none'
      })
    } else {
      wx.request({
        method: 'GET',
        data: {
          username: this.data.name,
          openId: app.globalData.openid,
          userWechat: this.data.wechatnum,
          userCity: this.data.city,
          userImg: this.data.image,
          userCompany: this.data.company,
          userIndustry: this.data.idustry,
          userPhone: this.data.phone,
          userJob: this.data.job,
          demand: this.data.demand,
          resources: this.data.resource,
          synopsis: this.data.introduction,
          userEmail: this.data.email
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          app.globalData.notadd = false
          console.log(res)
          var openid = app.globalData.openid;
          console.log(openid)
          var othercardid = app.globalData.othercardid;
          var openid = that.data.openid;
          var groupId = that.data.groupId;
          if (othercardid != "") {
            app.globalData.isshow = true
            app.globalData.notadd = false
            console.log(openid)
            wx.navigateTo({
              url: '/pages/peerscards/peerscards?othercardid=' + othercardid + '&isshow=true',
            })
          } else if (back) {
            app.globalData.notadd = false;
            console.log(openid);
            console.log(groupId);
            wx.redirectTo({
              url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
            })
          } else {
            app.globalData.notadd = false
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
        }
      })
    }
  },
  getPhoneNumber: function (e) {                                                        //用户点击微信获取手机
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
          console.log(res)
        }
      })
    }
  },
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  }
})
