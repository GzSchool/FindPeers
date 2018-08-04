// pages/addCards/addcards.js
import pinyin from '../../utils/pinyin.js'
import {
  validateEmail_none,
  isvalidatemobile_none
} from '../../utils/validate.js'
var app = getApp();
Page({
  data: {
    count: 0, //简介字数
    openid: "", //用户标识
    othercardid: "", //分享的人的标识
    groupId: "", //群id
    userId: 0, //用户id
    name: "", //用户名字
    other: '',
    wechatnum: "", //用户填写的微信号
    image: "", //用户的微信头像
    company: "", //用户填写的公司名称
    idustry: "", //用户选择的行业
    job: '', //用户填写的职务 
    city: "", //用户填写的城市
    phone: "", //用户手机号
    server: "", //服务器地址
    demand: "", //用户填写的需求
    introduction: "", //用户简介
    resource: "", //用户资源
    email: "", //用户邮箱
    back: "", //是否返回
    isshow: '', //是否显示
    isshow0: false, //需求是否显示
    isshow1: false, //资源是否显示
    formId: '',
    itemList: ["需求", "资源"], // 添加更多项
    saveLoading: false,
    region: '',
    customItem: ''
  },
  onLoad: function(res) {
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
      success: function(a) {
        that.setData({
          image: a.userInfo.avatarUrl
        })
      }
    })
  },
  // 用户点击添加更多
  addmore: function() {
    var that = this
    wx.showActionSheet({
      itemList: ["需求", "资源"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            isshow0: true
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            isshow1: true
          })
        }
      }
    })
  },
  addname: function (e) {
    this.data.prepare = pinyin.getFullChars(e.detail.value).toUpperCase()
    console.log(this.data.prepare)
    this.data.name = e.detail.value
  },
  addnumber: function(e) {
    this.data.wechatnum = e.detail.value
  },
  addcompany: function(e) {
    this.data.company = e.detail.value
  },
  addcity: function(e) {
    this.data.city = e.detail.value
  },
  addjob: function(e) {
    this.data.job = e.detail.value
  },
  addphone: function(e) {
    this.data.phone = e.detail.value
  },
  adddemand: function(e) {
    this.data.demand = e.detail.value
  },
  addresource: function(e) {
    this.data.resource = e.detail.value
  },
  addemail: function(e) {
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
  save: function() {
    let that = this
    if (this.data.name == '' || this.data.name == null) {
      // console.log(pinyin.getFullChars('dkdddkjkjjk').toUpperCase())
      wx.getUserInfo({
        success: function(a) {
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl,
            prepare: pinyin.getFullChars(a.userInfo.nickName).toUpperCase()
          })
          console.log(that.data.prepare)
          that.getData()
        }, fail: function () {
          app.showToast("姓名不能为空")
        }
      })
    } else {
      that.getData()
    }
  },
  getPhoneNumber: function(e) { //用户点击微信获取手机
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    // if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    // } else {
    // }
  },
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  },
  getData() {
    var that = this
    var othercardid = app.globalData.othercardid
    var server = this.data.server
    var back = false;
    if (this.data.back == "") {
      back = false
    } else {
      back = this.data.back
    }
    if (!isvalidatemobile_none(this.data.phone)) {
      app.showToast('手机号格式不正确')
    } else if (!validateEmail_none(this.data.email)) {
      app.showToast('邮箱格式不正确')
    } else if (this.data.job == '') {
      app.showToast('职务不能为空')
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
    } else if (this.data.name == '') {
      wx.getUserInfo({
        success: function(a) {
          console.log(a)
          this.data.name = a.userInfo.nickName;
        }
      })
    } else if (this.data.image == '') {
      wx.getUserInfo({
        success: function(a) {
          console.log(a)
          this.data.image = a.userInfo.avatarUrl;
        }
      })
    } else {
      that.data.saveLoading = true
      wx.request({
        method: 'POST',
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
          userEmail: this.data.email,
          prepare: this.data.prepare,
          formId: this.data.formId
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.data.saveLoading = true
          app.globalData.notadd = false
          console.log(res)
          var openid = app.globalData.openid;
          console.log(openid)
          var othercardid = app.globalData.othercardid;
          var openid = that.data.openid;
          var groupId = that.data.groupId;
          app.showToast("保存成功");
          if (othercardid != "") {
            app.globalData.isshow = true
            app.globalData.notadd = false
            console.log(openid)
            wx.redirectTo({
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
  submitInfo:function(e) {
    this.setData({
      formId: e.detail.formId
    })
    console.log(this.data.formId)
    let that = this
    if (this.data.name == '' || this.data.name == null) {
      wx.getUserInfo({
        success: function (a) {
          console.log(a)
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl
          })
          that.getData()
        }
      })
    } else {
      this.getData()
    }
  },
  cityChange(e) {
    this.setData({
      city: e.detail.value.join('')
    })
  }
})