// pages/peerscards/peerscards.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",         //用户名字
    city: "",         //用户城市
    idustry: "",      //用户行业
    server: "",       //服务器地址
    company: "",      //用户公司
    groupId: "",      //群组ID
    notadd: "",       //用户是否添加信息
    cardId: [],       //名片ID数组
    id:"",            //名片ID
    phone: "",        //用户手机号
    wechatnum: "",    //用户微信号
    image: "",        //用户头像
    email: "",        //用户邮箱
    userJob: '',      //用户职务
    isshow: false,    //是否显示信息
    otheropenId: "",  //别人的用户标识
    othercardid: '',  //别人的名片ID
    chooseSize: false,//选择动画
    animationData: {},//动画
    isgroup: "",      //判断是否是在群里点击的
    isSave: "",       //判断是否已保存这个名片
    checkSave: "",    //检验是不是保存了这个名片
    userInfo: {},     // 用户信息
    addPhone: false,  //判断是否添加了手机号
  },
  //分享
  onShareAppMessage: function(a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    var openId = app.globalData.openid;
    var id = that.data.othercardid;
    return {
      title: '同行信息',
      path: '/pages/findmore/findmore?othercardid=' + that.data.othercardid,
      success: function(res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',
              data: {
                openId: app.globalData.openId,
                otherOpenId: otheropenId,
                encryptedData: encryptedData,
                iv: iv
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(c) {
              }
            })
          }
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //页面加载
  onLoad: function(ops) {
    var that = this 
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
          // addPhone: res.data.userPhone?true:false,
          notadd: false
        })
      },
      fail: function () {
        that.setData({
          addPhone: false,
          notadd: true
        })
      }
    })
    if(ops.othercardid){
      that.data.othercardid = ops.othercardid
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    that.data.server = app.globalData.server;
    if (ops.groupId) {
      that.setData({
        groupId: ops.groupId
      })
    } else {
      that.setData({
        groupId: 0
      })
    }
    if(app.globalData.isgroup){
      that.setData({
        addPhone: app.globalData.addPhone
      })
    }else{
      that.setData({
        addPhone: true
      })
    }
    that.setData({
      isshow: app.globalData.isshow,
      isgroup: app.globalData.isgroup,
      notadd: app.globalData.notadd,
      checkSave: app.globalData.checkSave,
      othercardid:app.globalData.othercardid
    })     
    var othercardid = app.globalData.othercardid;
    util.getCardsById(othercardid).then(function (res) {
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
        userJob: res.data.data[0].userJob,
        id:res.data.data[0].id
      })
    })
  },
  addcards: function(e) {
    var that = this
    var openid = app.globalData.openid;
    var isshow = app.globalData.isshow;
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }
  },
  remove: function() {
    var that = this
    var server = app.globalData.server;
    var othercardid = app.globalData.othercardid;
    var groupId = that.data.groupId;
    var openid = app.globalData.openid;
    var cardId = that.data.cardId
    util.saveOrUpdate(openid, groupId, 1, cardId).then(function(res) {
      that.setData({
        isSave: false
      })
      wx.switchTab({
        url: '/pages/findmore/findmore',
      })
    })
  },
  back: function() {
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  chooseSize: function(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 400,
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
  save: function(e) {
    var that = this
    var server = app.globalData.server;
    var openid = app.globalData.openid;
    var groupId = that.data.groupId;
    var othercardid = app.globalData.othercardid
    var cardId = that.data.cardId
    cardId.push(othercardid)
    let saveName = this.data.userInfo.username
    let formId = e.detail.formId
    console.log(openid)
    console.log(groupId)
    console.log(cardId)
    console.log(saveName)
    console.log(formId)
    util.saveOrUpdate(openid, groupId, 2, cardId, saveName, formId).then(function(res) {
      console.log(res)      
      that.setData({
        isSave: true
      })
      wx.switchTab({
        url: '/pages/findmore/findmore',
      })
      // wx.navigateBack({
      //   delta: 1
      // })
    })
  },
  backToFind: function() {
    this.hideModal()
    // wx.switchTab({
    //   url: '/pages/findmore/findmore',
    // })
  },
  toTeamPeers: function(e) {
    var that =this
    var groupId = that.data.groupId;
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
    })
  }
})