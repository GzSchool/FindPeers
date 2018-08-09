// pages/otherpeers/otherpeers.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    cardId: "",          //名片ID
    id: "",              //名片ID
    notadd: "",          //判断用户是否已添加信息
    back: "",            //判断是否是从群里点击的
    name: "",            //用户名字
    issave: "",          //判断用户是否以保存这个名片
    city: "",            //用户城市
    idustry: "",         //用户行业
    groupId: '',         //群组ID
    server: "",          //服务器地址
    company: "",         //用户公司
    phone: "",           //用户手机号
    wechatnum: "",       //用户微信号
    image: "",           //用户头像
    email: "",           //用户邮箱
    userJob: '',         //用户职务
    demand: '',          // 需求
    resources: '',       // 资源
    synopsis: '',        // 简介
    otheropenId: "",     //同行标识
    searching: false, 
    userInfo: {},        // 用户信息
    addPhone:""          //判断用户是否已添加手机号
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(ops) {
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this
    // 获取缓存中用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
    that.setData({
      addPhone:app.globalData.addPhone,
      cardId: ops.cardId,
      notadd: app.globalData.notadd,
      groupId: ops.groupId,
    })
    if (ops.saveFlag) {
      if (ops.saveFlag == 2) {
        that.setData({
          isSave: true
        })
      } else {
        that.setData({
          isSave: false
        })
      }
    }
    if (ops.back) {
      that.setData({
        back: true
      })
    } else {
      that.setData({
        back: false
      })
    }
    let server = app.globalData.server;
    let cardId = that.data.cardId
    util.getCardsById(cardId).then(function(res) {
      console.log(res.data.data[0])
      that.setData({
        name: res.data.data[0].username,
        wechatnum: res.data.data[0].userWechat,
        company: res.data.data[0].userCompany,
        idustry: res.data.data[0].userIndustry,
        city: res.data.data[0].userCity,
        email: res.data.data[0].userEmail,
        phone: res.data.data[0].userPhone,
        image: res.data.data[0].userImg,
        otheropenId: res.data.data[0].openId,
        id: res.data.data[0].id,
        demand: res.data.data[0].demand,       // 需求
        resources: res.data.data[0].resources, // 资源
        synopsis: res.data.data[0].synopsis,   // 简介
        userJob: res.data.data[0].userJob      // 职位
      })
    })
  },
  //添加信息按钮
  addcards: function(e) {
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }
  },
  //删除同行信息
  remove: function() {
    let that = this
    let openid = app.globalData.openid;
    let cardIds = []
    cardIds.push(that.data.cardId)
    let groupId = that.data.groupId
    let back = that.data.back;
    util.saveOrUpdate(openid, groupId, 1, cardIds).then(function(res) {
      if (back) {
        wx.navigateTo({
          url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
        })
      } else {
        wx.switchTab({
          url: '/pages/findmore/findmore',
        })
      }

    })

  },
  //点击设置图标动画
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
        animationData: animation.export()
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
        chooseSize: false
      })
    }, 200)
  },
  //点击保存到通讯录
  saveToPhone: function() {
    let that = this
    if (that.data.phone) {
      wx.addPhoneContact({
        firstName: that.data.name,
        mobilePhoneNumber: that.data.phone,
        success: function(a) {
         that.hideModal();
        },
        fail: function(p) {
          that.hideModal();
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '该同行名片手机号为空',
        confirmText: '知道了',
        success: function(res) {
          that.hideModal();
          that.setData({
            showModal2: false
          });
        },
        fail: function(p) {
          that.hideModal();
        }
      })
    }
  },
  /**
   * 保存其他用户名片夹 formId推送提示
   */
  save: function(e) {
    var that = this
    var server = app.globalData.server;
    var openid = app.globalData.openid;
    var groupId = that.data.groupId
    var cardIds = []
    var back = that.data.back
    cardIds.push(that.data.cardId)
    let saveName = this.data.userInfo.username
    let formId = e.detail.formId
    util.saveOrUpdate(openid, groupId, 2, cardIds, saveName, formId).then(function(res) {
      console.log(res)
      if (back) {
        wx.redirectTo({
          url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
        })
      } else {
        wx.switchTab({
          url: '/pages/findmore/findmore',
        })
      }
    })
  },
  //分享转发
  onShareAppMessage: function (a) {
    var that = this
    return {
      title: '同行信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.id,
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = that.data.otheropenId;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  }
})