// pages/mycards/mycards.js
import { validateEmail, isvalidatemobile} from '../../utils/validate.js'
var app = getApp();
Page({
  data: {
    count: 0,
    name: "",
    other: '',
    wechatnum: "",
    company: "",
    idustry: "",
    job: '',
    back:"",
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
    if(a.back){
      that.setData({
        back:true
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
      itemList: ["需求", "资源", "邮箱"],
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
  addname: function(e) {
    if (e.detail.value == '') {
    } else {
      this.setData({
        name: e.detail.value
      })
    }
  },
  addnumber: function(e) {
    if (e.detail.value == '') {
      app.showToast('微信号不能为空')
    } else {
      this.setData({
        wechatnum: e.detail.value
      })
    }
  },
  addcompany: function(e) {
    if (e.detail.value == '') {
      app.showToast('公司名称不能为空')
    } else {
      this.setData({
        company: e.detail.value
      })
    }
  },
  addcity: function(e) {
    if (e.detail.value == null) {
      app.showToast('城市信息不能为空')
    } else {
      this.setData({
        city: e.detail.value
      })
    }
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
  save: function(e) {
    var server = app.globalData.server
    var that=this
    if (isvalidatemobile(this.data.phone)[0]) {
      app.showToast(isvalidatemobile(this.data.phone)[1])
    } else if (!validateEmail(this.data.email)) {
      app.showToast('邮箱格式不正确')
    } else if (this.data.wechatnum == '') {
      app.showToast('微信号不能为空')
    } else if (this.data.company == '') {
      app.showToast('公司名称不能为空')
    } else if (this.data.idustry == '') {
      app.showToast('行业信息不能为空')
    } else if (this.data.city == '') {
      app.showToast('城市信息不能为空')
    } else {
      wx.request({
        method: 'GET',
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
        success: function(res) {
          var back = that.data.back;
          console.log(back)
          if (back){
            wx.navigateBack({
              delta:2
            })
          }else{
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }                   
        }
      })
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
  }
})