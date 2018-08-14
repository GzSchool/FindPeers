// pages/peerscards/peerscards.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    myCardId: '',
    server: app.globalData.server, //服务器地址
    groupId: 0, //群组ID
    cardId: [], //名片ID数组
    id: "", //名片ID
    otheropenId: "", //别人的用户标识
    othercardid: '', //别人的名片ID
    cardType: "", //名片类型
    name: "", //用户名字
    city: "", //用户城市
    idustry: "", //用户行业
    company: "", //用户公司
    phone: "", //用户手机号
    wechatnum: "", //用户微信号
    image: "", //用户头像
    email: "", //用户邮箱
    userJob: '', //用户职务
    homepage: "", // 个人主页
    compayWeb: "", // 公司官网  
    demand: "",  // 需求
    resources: "", // 资源
    synopsis: "",  // 简介
    chooseSize: false, //选择动画
    animationData: {}, //动画
    userInfo: {}, // 缓存获取用户信息 - 用户提交formid时拿到用户名
    appOPS: '',   // globalData路由参数判断scene
    samePeer: false, //判断名片跟用户是不是同一人  
    addPhone: false, //判断是否添加了手机号
    checkSave: true, //检验是不是保存了这个名片
    isgroup: '', //判断是否是在群里点击的
    notadd: false, //用户是否添加信息
    remark: '' // 备注
  },
  //页面加载
  onLoad: function(ops) {
    console.log(ops)
    let that = this
    var openid = wx.getStorageSync('openid');
    if (openid) {
      app.globalData.openid = openid
      that.data.openid = openid
    } else {
      app.login()
    }
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
        that.setData({
          userInfo: res.data,
          myCardId: res.data.id
        })
        if (res.data.userPhone) {
          app.globalData.addPhone = true
          that.setData({
            addPhone: true
          })
        }
      },
      fail: function() {
        app.globalData.notadd = true
        that.setData({
          notadd: true
        })
      }
    })
    // 拷贝自 app.js
    let server = app.globalData.server
    let url = app.globalData.urlOfLogin
    // 要是有id 说明点击的别人分享的（只有两个 一是：群里点击的、扫描二维码， 二是：别人分享的）
    if (ops.othercardid || ops.scene) {
      app.globalData.othercardid = ops.othercardid; 
      that.setData({
        othercardid: ops.othercardid,
        appOPS: app.globalData.appOPS
      })
      if (ops.scene) {
        app.globalData.othercardid = ops.scene;
        that.setData({
          othercardid: ops.scene
        })
      }
      that.getPeerData(that.data.othercardid)
      that.checkedSave(app.globalData.openid, that.data.othercardid)
      // 获取 othercardid 用户信息
      if (app.globalData.openid) {
        if (that.data.checkSave) {
          that.getPeerInfo(app.globalData.openid, that.data.othercardid)
        } else {
          that.getPeerData(that.data.othercardid)
        }
      }
      if (that.data.appOPS.scene == 1044) {
        that.setData({
          isgroup: true,
          addPhone: app.globalData.addPhone
        })
      } else {
        that.setData({
          isgroup: false,
          addPhone: true
        })
      }
      // 等于 1044 是群里点击的
      if (that.data.appOPS.scene == 1044) {
        // 群里点击的回带shareTickets可以用这个获取groupid
        var shareTickets = this.data.appOPS.shareTicket;
        wx.getShareInfo({
          shareTicket: shareTickets,
          success: function(res) {
            console.log(res)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            if (app.globalData.openid) {
              var openid = app.globalData.openid;
              // 用户标识访问数据库获取用户信息
              that.getMyData(openid)
              // 检查是否保存
              console.log(that.data.checkSave)
              if (that.data.checkSave) {
                that.getPeerInfo(openid, that.data.othercardid)
              } else {
                that.getPeerData(that.data.othercardid)
              }
              // 获取GID           
              util.getCardsById(that.data.othercardid).then(function(card) {
                wx.request({
                  method: 'POST',
                  url: server + '/userGroup/saveOrUpdate',
                  data: {
                    openId: app.globalData.openid,
                    otherOpenId: card.data.data[0].openId,
                    encryptedData: encryptedData,
                    iv: iv
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function(c) {
                    if (c.data.data) {
                      that.setData({
                        groupId: c.data.data
                      })
                    }
                  }
                })
              })
            } else {
              // 登录
              util.Login(url).then(function(data) {
                if (data) {
                  app.globalData.openid = data
                }
                var openid = app.globalData.openid;
                // 用户标识访问数据库获取用户信息
                that.getMyData(openid)
                // 检查是否保存
                if (that.data.checkSave) {
                  that.getPeerInfo(openid, that.data.othercardid)
                } else {
                  that.getPeerData(that.data.othercardid)
                }
                // 获取GID           
                util.getCardsById(that.data.othercardid).then(function(card) {
                  wx.request({
                    method: 'POST',
                    url: server + '/userGroup/saveOrUpdate',
                    data: {
                      openId: app.globalData.openid,
                      otherOpenId: card.data.data[0].openId,
                      encryptedData: encryptedData,
                      iv: iv
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(c) {
                      if (c.data.data) {
                        that.setData({
                          groupId: c.data.data
                        })
                      }
                    }
                  })
                })
              })
            }
          }
        })
        // 点击的个人的分享
      } else {
        console.log("点击个人的分享")
        that.setData({
          isgroup: false,
          addPhone: true
        })
        if (app.globalData.openid) {
          var openid = app.globalData.openid          
          if (that.data.checkSave) {
            that.getPeerInfo(openid, that.data.othercardid)
          } else {
            that.getPeerData(that.data.othercardid)
          }
          that.getMyData(openid)
        } else {
          // 登录
          util.Login(url).then(function (data) {
            if (data) {
              app.globalData.openid = data
              var openid = app.globalData.openid
              // 检查保存
              if (that.data.checkSave) {
                that.getPeerInfo(openid, that.data.othercardid)
              } else {
                that.getPeerData(that.data.othercardid)
              }
              that.getMyData(openid)
            }
          })
        }
      }
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  getMyData(openid) {
    var that = this
    util.getMyData(openid).then(function(res) {
      if (res) {
        app.globalData.notadd = false
        that.setData({
          notadd: false
        })
        if (res.userPhone) {
          that.setData({
            addPhone: true
          })
          app.globalData.addPhone = true
        } else {
          that.setData({
            addPhone: false
          })
          app.globalData.addPhone = false
        }
      } else {
        app.globalData.addPhone = false
        app.globalData.notadd = true
        that.setData({
          notadd: true,
          addPhone: false
        })
      }
    })
  },
  // 检查保存
  checkedSave(openid, otherid) {
    let that = this
    console.log(openid)
    console.log(otherid)    
    util.checkSave(openid, otherid).then(function(a) {
      console.log(a)
      console.log(that.data.otheropenId)          
      if (openid == that.data.otheropenId) {
        that.setData({
          isSave: true,
          checkSave:true,
          samePeer: true
        })
      }
      if (a.data.data) {
        that.setData({
          checkSave: true,
          samePeer: false
        })
      }else {
        that.setData({
          checkSave: false,
          samePeer: true
        })
      }
    })
  },
  // 获取同行名片信息
  getPeerInfo(openId, otherId) {
    let that = this
    util.getPeerInfo(openId, otherId).then(function(res) {
      console.log(res)
      that.setData({
        name: res.data.data.username,
        wechatnum: res.data.data.userWechat,
        company: res.data.data.userCompany,
        idustry: res.data.data.userIndustry,
        city: res.data.data.userCity,
        email: res.data.data.userEmail,
        phone: res.data.data.userPhone,
        image: res.data.data.userImg,
        homepage: res.data.data.homePage,
        companyWeb: res.data.data.companyPage,
        otheropenId: res.data.data.openId,
        userJob: res.data.data.userJob,
        demand: res.data.data.demand,       // 需求
        resources: res.data.data.resources, // 资源
        synopsis: res.data.data.synopsis,   // 简介
        userJob: res.data.data.userJob,      // 职位
        id: res.data.data.id,
        cardType: res.data.data.cardType,
        remark: res.data.data.remark ? res.data.data.remark : ''        
      })
    })
  },
  getPeerData(othercardid) {
    let that = this
    util.getCardsById(othercardid).then(function(res) {
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
        homepage: res.data.data[0].homePage,
        companyWeb: res.data.data[0].companyPage,
        otheropenId: res.data.data[0].openId,
        demand: res.data.data[0].demand,       // 需求
        resources: res.data.data[0].resources, // 资源
        synopsis: res.data.data[0].synopsis,   // 简介
        userJob: res.data.data[0].userJob,     // 职位
        userJob: res.data.data[0].userJob,
        id: res.data.data[0].id,
        cardType: res.data.data[0].cardType,
      })
    })
  },
  addcards: function(e) {
    var that = this
    var openid = app.globalData.openid;
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
        content: '该张名片手机号为空',
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
    util.saveOrUpdate(openid, groupId, 2, cardId, saveName, formId).then(function(res) {
      console.log(res)
      wx.switchTab({
        url: '/pages/findmore/findmore',
      })
    })
  },
  backToFind: function() {
    this.hideModal()
  },
  toTeamPeers: function(e) {
    if (this.data.groupId) {
      var that = this
      var groupId = that.data.groupId;
      var openid = app.globalData.openid;
      console.log(openid)
      console.log(app.globalData.notadd)
      wx.navigateTo({
        url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
      })
    }
  },
  copy: function(e) {
    console.log(e)
    var num = e.currentTarget.dataset.num;
    wx.setClipboardData({
      data: num,
      success: function(a) {
        app.showToast('复制成功');
        console.log(a)
        // wx.getClipboardData({
        //   success:function(res){
        //     console.log(res)
        //   }
        // })
      }
    })
  },
  //分享
  onShareAppMessage: function(a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    var openId = app.globalData.openid;
    var id = that.data.othercardid;
    return {
      title: '名片信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.othercardid,
      success: function(res) {
        let openId = app.globalData.openid;
        let otherOpenId = that.data.otheropenId;
        util.sharePage(openId, otherOpenId, res).then(function(e) {
          console.log(e)
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  onShow: function(ops) {
    // app.showToast('show')
    // 场景为新用户从群内点进别人名片，添加个人名片后返回
    // this.data.notadd = app.globalData.notadd
    // var ops = {othercardid: app.globalData.othercardid}
    // this.onLoad(ops)    
  },
  addRemark: function(e) {
    let openId = app.globalData.openid
    let cardId = this.data.othercardid
    let remark = e.detail.value
    util.addRemark(openId, cardId, remark).then(function(res) {
      console.log(res.data)
    })
  }
})