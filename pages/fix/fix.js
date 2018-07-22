// pages/mycards/mycards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name1: "",
    adress1: "",
    idustry1: "",
    company1: "",
    phone1: "",
    wechatnum1: "",
    emai1: "",
    openid: "",
    userId: 0,
    name: "",
    other: '',
    wechatnum: "",
    company: "",
    idustry: "",
    job: '',
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
    wx.showShareMenu({
      withShareTicket: true
    })
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    console.log(openid)
    wx.request({
      method: 'GET',
      url: 'http://localhost:8080/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        that.setData({
          name1: b.data.data.username,
          wechatnum1: b.data.data.userWechat,
          company1: b.data.data.userCompany,
          idustry1: b.data.data.userIndustry,
          city1: b.data.data.userCity,
          emai1: b.data.data.userEmail,
          phone1: b.data.data.userPhone,
          //image: b.data.data.userImg,
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
    if (other) {
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
          url: 'http://localhost:8080/userCard/saveOrUpdate',
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
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid + '&isshow=true',
              })
              /*wx.switchTab({
                url: '/pages/findmore/findmore',
              })*/
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
    } else {
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
            username: this.data.name,
            openId: this.data.openid,
            userWechat: this.data.wechatnum,
            userCity: this.data.city,
            userJob: this.data.job,
            userCompany: this.data.company,
            userIndustry: this.data.idustry,
            userPhone: this.data.phone,
            userJob: this.data.job,
            demande: this.data.demand,
            resources: this.data.resource,
            synopsis: this.data.introduction,
            userEmail: this.data.email
          },
          url: 'http://localhost:8080/userCard/saveOrUpdate',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            var openid = app.globalData.openid;
            var otheropenid = app.globalData.otheropenid;
            if (otheropenid != "") {
              app.globalData.notadd = true;
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid + '&isshow=true',
              })
            } else {
              app.globalData.notadd = true;
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            }
          }
        })
      }
    }
  }


})