// pages/mycards/mycards.js
import pinyin from '../../utils/pinyin.js'
import {
  validateEmail_none,
  isvalidatemobile_none
} from '../../utils/validate.js'
var app = getApp();
Page({
  data: {
    mineInfo: {
      name: '',
      wechatnum: '',
      company: '',
      idustry: '',
      city: '',
      email: '',
      phone: '',
      image: '',
      demand: '',
      resource: '',
      introduction: '',
      id: '',
      job: ''
    },
    count: 0,
    groupId: "",
    name: "",
    other: '',
    wechatnum: "",
    company: "",
    idustry: "",
    job: '',
    back: "",
    server: "",
    id: '',
    city: "",
    phone: "",
    demand: "",
    introduction: "",
    resource: "",
    email: "",
    isshow: '',
    isshow0: false,
    isshow1: false,
    isshow2: false,
    image: "/pages/images/1.png",
    prepare: '',
    showphone: false,
    showdemand: false,
    showresource: false,
    showintroduction: false
  },
  onLoad: function(a) {
    var that = this
    console.log(a)
    that.data.server = app.globalData.server
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(a.back)
    if (a.back) {
      that.setData({
        back: true,
        groupId: a.groupId
      })
    }
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    console.log(openid)
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        console.log(b)
        that.setData({
          mineInfo: {
            name: b.data.data.username,
            idustry: b.data.data.userIndustry,
            city: b.data.data.userCity,
            company: b.data.data.userCompany,
            phone: b.data.data.userPhone,
            wechatnum: b.data.data.userWechat,
            email: b.data.data.userEmail
          },
          name: b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          email: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
          demand: b.data.data.demand,
          resource: b.data.data.resources,
          introduction: b.data.data.synopsis,
          id: b.data.data.id,
          job: b.data.data.userJob
        })
        if (that.data.demand !== '') {
          that.setData({
            isshow0: true
          })
        }
        if (that.data.resource !== '') {
          that.setData({
            isshow1: true
          })
        }
        if (that.data.email !== '') {
          that.setData({
            isshow2: true
          })
        }
      }
    })
  },
  viewThisCards: function() {
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/viewThis/viewThis?openid=' + openid,
    })
  },
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
        } else {
          that.setData({
            isshow2: true
          })
        }
      }
    })
  },
  addname: function (e) {
    this.data.prepare = pinyin.getCamelChars(e.detail.value).toUpperCase().substr(0,1)
    console.log(this.data.prepare)
    this.data.name = e.detail.value
  },
  addnumber: function (e) {
    this.setData({
      wechatnum: e.detail.value
    })
  },
  addcompany: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  addcity: function (e) {
    this.setData({
      city: e.detail.value
    })
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
  introInput: function(e) {
    let i = e.detail.value.length
    this.data.introduction = e.detail.value
    this.setData({
      count: i
    })
  },
  save: function () {
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
  getPhoneNumber: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {
          console.log(res)
        }
      })
    }
  },
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  },
  getData: function() {
    let server = this.data.server
    let that = this
    if (!isvalidatemobile_none(this.data.phone)) {
      app.showToast('手机号格式不正确')
    } else if (!validateEmail_none(this.data.email)) {
      app.showToast('邮箱格式不正确')
    } else if (this.data.job == '') {
      app.showToast('职务不能为空')
    } else if (this.data.wechatnum == '') {
      app.showToast('微信号不能为空')
    } else if (this.data.company == '') {
      app.showToast('公司名称不能为空')
    } else if (this.data.idustry == '') {
      app.showToast('行业信息不能为空')
    } else if (this.data.city == '') {
      app.showToast('城市信息不能为空')
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
      wx.request({
        method: 'POST',
        data: {
          id: this.data.id,
          username: this.data.name,
          openId: this.data.openid,
          userWechat: this.data.wechatnum,
          userCity: this.data.city,
          userCompany: this.data.company,
          userIndustry: this.data.idustry,
          userPhone: this.data.phone,
          userJob: this.data.job,
          demand: this.data.demand,
          resources: this.data.resource,
          synopsis: this.data.introduction,
          userEmail: this.data.email,
          prepare: this.data.prepare
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          // wx.showToast({
          //   title: '修改成功',
          //   icon: 'success',
          //   duration: 3000
          // });
          app.showToast("修改成功");
          var back = that.data.back;
          console.log(back)
          if (back) {
            var openid = app.globalData.openid;
            var groupId = that.data.groupId
            console.log(groupId)
            wx.navigateTo({
              url: '/pages/teampeers/teampeers?groupid=' + groupId + '&openid=' + openid,
            })
          } else {
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
        }
      })
    }
  }
})