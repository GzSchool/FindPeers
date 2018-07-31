// pages/mycards/mycards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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
    console.log(e)
    if (e.detail.value == null) {

    } else {
      this.setData({
        name: e.detail.value
      })
    }
  },
  addnumber: function(e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
    } else {
      // this.data.wechatnum = e.detail.value
      // console.log(e.detail.value)
      this.setData({
        wechatnum: e.detail.value
      })
    }
  },
  addcompany: function(e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else {
      this.setData({
        company: e.detail.value
      })

      // this.data.company = e.detail.value
      // console.log(e.detail.value)
    }
  },
  // addidustry: function(e) {
  //   var that = this
  //   var server = that.data.server
  //   if (e.detail.value == null) {
  //     wx.showToast({
  //       title: '行业信息不能为空',
  //     })
  //   } else {

  //     this.data.idustry = e.detail.value
  //     console.log(e.detail.value)
  //   }
  // },
  addcity: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '城市信息不能为空',
      })
    } else {
      this.setData({
        city: e.detail.value
      })

      // this.data.city = e.detail.value
      // console.log(e.detail.value)
    }
  },
  addjob: function(e) {
    this.data.job = e.detail.value
  },
  addphone: function(e) {

    this.data.phone = e.detail.value
    console.log(e.detail.value)
  },
  adddemand: function(e) {

    this.data.demand = e.detail.value
    console.log(e.detail.value)
  },
  addresource: function(e) {

    this.data.resource = e.detail.value
    console.log(e.detail.value)
  },
  addemail: function(e) {

    this.data.email = e.detail.value
    console.log(e.detail.value)
  },
  addintroduction: function(e) {

    this.data.introduction = e.detail.value
    console.log(introduction)
  },
  save: function(e) {
    console.log('save')
    var server = app.globalData.server
    var that=this
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
  chooseSize: function(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),

      })
    }, 200)
  },
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,
        cansee: true
      })
    }, 200)
  },
  select: function(e) {
    console.log(e)
    var industry = e.currentTarget.dataset.value;
    this.setData({
      idustry: industry
    })
    this.hideModal();
  },
  select: function(e) {
    console.log(e)
    var industry = e.currentTarget.dataset.value;
    this.setData({
      idustry: industry
    })
    this.hideModal();
  },
  introInput(e) {
    let i = e.detail.value.length
    this.setData({
      count: i
    })
  },
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  }
})