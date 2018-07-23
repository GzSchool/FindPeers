// pages/mycards/mycards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    other: '',
    wechatnum: "",
    company: "",
    idustry: "",
    job: '',
    server:"",
    id:'',
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
  onLoad: function (a) {
    var that = this
    that.data.server=app.globalData.server
    wx.showShareMenu({
      withShareTicket: true
    })
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    console.log(openid)
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server+'/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
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
          id:b.data.data.id,
          job:b.data.data.userJob
        })
      }
    })
  },
  viewThisCards: function () {
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/viewThis/viewThis?openid=' + openid,
    })
  },
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
    console.log(e)
    if (e.detail.value == null) {

    } else {
      this.data.name = e.detail.value
    }
  },
  addnumber: function (e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '微信号不能为空',
      })
    } else {
      this.data.wechatnum = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcompany: function (e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else {

      this.data.company = e.detail.value
      console.log(e.detail.value)
    }
  },
  addidustry: function (e) {
    var server = that.data.server
    if (e.detail.value == null) {
      wx.showToast({
        title: '行业信息不能为空',
      })
    } else {

      this.data.idustry = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcity: function (e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '城市信息不能为空',
      })
    } else {

      this.data.city = e.detail.value
      console.log(e.detail.value)
    }
  },
  addjob: function (e) {
    this.data.job = e.detail.value
  },
  addphone: function (e) {

    this.data.phone = e.detail.value
    console.log(e.detail.value)
  },
  adddemand: function (e) {

    this.data.demand = e.detail.value
    console.log(e.detail.value)
  },
  addresource: function (e) {

    this.data.resource = e.detail.value
    console.log(e.detail.value)
  },
  addemail: function (e) {

    this.data.email = e.detail.value
    console.log(e.detail.value)
  },
  addintroduction: function (e) {

    this.data.introduction = e.detail.value
    console.log(introduction)
  },
  save: function (e) {
    var other = this.data.other
    
      if (this.data.wechatnum == null) {
        wx.showToast({
          title: '微信号不能为空',
        })
      } else if (this.data.company == null) {
        wx.showToast({
          title: '公司名称不能为空'
        })
      } else if (this.data.idustry == null) {
        wx.showToast({
          title: '行业信息不能为空',
        })
      } else if (this.data.city == null) {
        wx.showToast({
          title: '城市信息不能为空',
        })
      } else {
        wx.request({
          method: 'GET',
          data: {
            id:this.data.id,
            username: this.data.name,
            openId: this.data.openid,
            userWechat: this.data.wechatnum,
            userCity: this.data.city,
            userCompany: this.data.company,
            userIndustry: this.data.idustry,
            userPhone: this.data.phone,
            userJob: this.data.job,
            userJob: this.data.job,
            demande: this.data.demand,
            resources: this.data.resource,
            synopsis: this.data.introduction,
            userEmail: this.data.email
          },
          url: server+'/userCard/saveOrUpdate',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            var openid = app.globalData.openid;
            console.log(openid)
            var otheropenid = app.globalData.otheropenid;
            console.log(otheropenid)
            if (otheropenid != "") {
              console.log(openid)
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            } else {
              console.log(openid)
              app.globalData.notadd = true;
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            }
          }
        })
      }
    
    }
  


})