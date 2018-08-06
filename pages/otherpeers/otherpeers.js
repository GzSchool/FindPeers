// pages/otherpeers/otherpeers.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: "",
    id: "",
    notadd: "",
    back: "",
    name: "",
    issave: "",
    city: "",
    idustry: "",
    groupId: '',
    server: "",
    company: "",
    phone: "",
    wechatnum: "",
    image: "",
    email: "",
    userJob: '',
    demand: '', // 需求
    resources: '', // 资源
    synopsis: '', // 简介
    isshow: false,
    otheropenId: ""
  },
  onShareAppMessage: function(a) {
    var server = app.globalData.server
    var that = this
    var otheropenId = that.data.otheropenId;
    var openId = app.globalData.openid;
    var back = that.data.back;
    var groupId = that.data.groupId;
    console.log(otheropenId)
    return {
      title: '同行信息',
      path: '/page/peerscards/peerscards?othercardid=' + that.data.id,
      success: function(res) {
        console.log("66666666666")
        console.log(res)
        console.log(a)
        var shareTickets = res.shareTickets;
        console.log(res.shareTickets)
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            console.log(res)
            console.log(a)
            console.log(otheropenId)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            console.log(iv)
            console.log(encryptedData)
            console.log(openId)
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',
              data: {
                openId: openId,
                otherOpenId: otheropenId,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function(c) {
                console.log(c)
                that.hideModal();
                // if (back) {
                //   wx.navigateTo({
                //     url: '/pages/teampeers/teampeers?openid=' + openId + '&groupid=' + groupId,
                //   })
                // } else {
                //   wx.navigateTo({
                //     url: '/pages/otherpeers/otherpeers',
                //   })
                // }
              }
            })
          }
        })
      },
      fail: function(res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(ops) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this
    console.log(ops)
    that.setData({
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
    var server = app.globalData.server;
    var cardId = that.data.cardId
    util.getCardsById(cardId).then(function(res) {
      console.log(res)
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
        demand: res.data.data[0].demand, // 需求
        resources: res.data.data[0].resources, // 资源
        synopsis: res.data.data[0].synopsis,  // 简介
        userJob: res.data.data[0].userJob  // 职位
      })
    })
  },
  addcards: function(e) {
    var othercardid = app.globalData.othercardid;
    console.log(othercardid)
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }
  },
  remove: function() {
    var that = this
    var openid = app.globalData.openid;
    var cardIds = []
    cardIds.push(that.data.cardId)
    var groupId = that.data.groupId
    var back = that.data.back;
    console.log(cardIds)
    console.log(groupId)
    console.log(openid)
    util.saveOrUpdate(openid, groupId, 1, cardIds).then(function(res) {
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
  saveToPhone: function() {
    var that = this
    if (that.data.phone) {
      console.log(that.data.phone)
      wx.addPhoneContact({
        firstName: that.data.name,
        mobilePhoneNumber: that.data.phone,
        success: function(a) {
          wx.navigateBack({
            delta: 1
          })
        },
        fail: function(p) {
          console.log(p)
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
          console.log(p)
          that.hideModal();
        }
      })
    }
  },
  save: function() {
    var that = this
    var server = app.globalData.server;
    var openid = app.globalData.openid;
    var othercardid = app.globalData.othercardid
    var cardId = that.data.cardId
    var groupId = that.data.groupId
    var cardIds = []
    var length = cardId.length;
    var back = that.data.back
    console.log(length)
    cardIds.push(that.data.cardId)
    console.log(openid + "" + groupId + "" + cardIds)
    console.log(cardIds)
    util.saveOrUpdate(openid, groupId, 2, cardIds).then(function(res) {
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
  }
})