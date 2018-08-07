// pages/peerscards/peerscards.js
var util = require('../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    city: "",
    idustry: "",
    server:"",
    company: "",
    groupId:"",
    notadd:"",
    cardId:[],
    phone: "",
    wechatnum: "",
    image:"",
    email:"",
    userJob: '',
    isshow:false,
    otheropenId:"",
    othercardid:'',
    chooseSize: false,
    animationData: {},
    isgroup:"",                  //判断是否是在群里点击的
    isSave:"",                    //判断是否已保存这个名片
    checkSave:""             //检验是不是保存了这个名片
  },
  onShareAppMessage:function(a){
    var server = app.globalData.server;
    var that=this
    var otheropenId = that.data.otheropenId;
    return {
      title: '同行信息',
      path: '/pages/peerscards/peerscards?othercardid=' + that.data.othercardid,
      success: function (res) {
        console.log("66666666666")
        console.log(res)
        console.log(a)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)
            console.log(a)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'POST',
              url: server+'/userGroup/saveOrUpdate',

              data: {
                openId: app.globalData.openId,
                otherOpenId: otheropenId,                
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                // wx.navigateTo({
                //   url: '/pages/peerscards/peerscards',
                // })
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  },
  onLoad:function(ops){
    var that = this
    if(ops.othercardid){
      app.globalData.othercardid = ops.othercardid;
      that.othercardid = ops.othercardid;
      var othercardid = ops.othercardid;
      if (ops.scene == 1044) {                                            // 等于这个 就是群里点击的
        app.globalData.isgroup=true
        that.data.isgroup = true;
        var shareTickets = ops.shareTicket;
        console.log(ops.shareTicket)                                      //群里点击的回带shareTickets可以用这个获取groupid
        wx.getShareInfo({
          shareTicket: shareTickets,
          success: function(res) {
            console.log(res)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            util.Login(url).then(function (data) {                    // 登录
              if (data) {
                app.globalData.openid = data
                var openid = app.globalData.openid
              }
              var openid = app.globalData.openid;                  //用用户标识访问数据库获取用户信息
              var othercardid = app.globalData.othercardid;
              util.getMyData(openid).then(function (res) {
                if(res){
                  app.globalData.isshow = true
                  app.globalData.notadd = false
                  that.data.isshow = true
                  that.data.notadd = false
                }else{
                  app.globalData.isshow = false
                  app.globalData.notadd = true
                  that.data.isshow = false
                  that.data.notadd = true
                }
              })
              util.checkSave(openid,othercardid).then(function(a){
                console.log(a)
                if (a.data.data) {
                  app.globalData.checkSave = true
                  that.data.checkSave = true
                } else {
                  app.globalData.checkSave = false
                  that.data.checkSave = false
                }
              })
              var othercardid = app.globalData.othercardid;              
              util.getCardsById(othercardid).then(function (card) {
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
                  userJob: res.data.data[0].userJob
                })
                console.log(app.globalData.openid)
                console.log(card.data.data[0].openId)
                console.log(encryptedData)
                console.log(iv)
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
                  success: function (c) {
                    console.log(c)
                  }
                })
              })
            })           
          }
        })        
      } else {                                             //点击的个人的分享
        app.globalData.isgroup=false
        var othercardid = ops.othercardid
        util.Login(url).then(function (data) {                     // 登录
          console.log(data)
           if (data) {
             app.globalData.openid = data
             var openid = app.globalData.openid
          }
          var openid = app.globalData.openid;                      //用用户标识访问数据库获取用户信息
          util.checkSave(openid, othercardid).then(function (a) {
            if(a.data.data){
              app.globalData.checkSave=true
              that.data.checkSave = true
            }else{
              app.globalData.checkSave = false
              that.data.checkSave = false              
            }
          })
          util.getMyData(openid).then(function (res) {                          
            console.log(res)
            if (res) {
              app.globalData.isshow = true
              app.globalData.notadd = false
              that.data.isshow = true
              that.data.notadd = false
              
            } else {
              app.globalData.notadd = true
              app.globalData.isshow = false
              that.data.notadd = true
              that.data.isshow = false

            }
            util.getCardsById(othercardid).then(function (card) {
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
                userJob: res.data.data[0].userJob
              })
            })
          })
        })
      }
    } 
    wx.showShareMenu({
      withShareTicket:true
    })
    if(ops.groupId){
      that.setData({
        groupId:ops.groupId
      })
    }else{
      that.setData({
        groupId: 0
      })
    }
    console.log(ops)
    that.data.server=app.globalData.server;
    that.setData({
      isshow: app.globalData.isshow,
      isgroup:app.globalData.isgroup,
      notadd:app.globalData.notadd,
      checkSave:app.globalData.checkSave
    }) 
    // console.log(app.globalData.checkSave)
    // var openid=app.globalData.openid
    // var server = that.data.server
    // var othercardid=app.globalData.othercardid;
    // that.data.cardId=[];
    // that.data.cardId.push(othercardid);
    // util.getCardsById(othercardid).then(function (res) {
    //   console.log(res)
    //   that.setData({
    //     name: res.data.data[0].username,
    //     wechatnum: res.data.data[0].userWechat,
    //     company: res.data.data[0].userCompany,
    //     idustry: res.data.data[0].userIndustry,
    //     city: res.data.data[0].userCity,
    //     email: res.data.data[0].userEmail,
    //     phone: res.data.data[0].userPhone,
    //     image: res.data.data[0].userImg,
    //     otheropenId: res.data.data[0].openId,
    //     userJob: res.data.data[0].userJob
    //   })
    //   if (res.data.data[0].delFlag == 1){
    //     that.setData({
    //       isSave:false
    //     })
    //   }else{
    //     that.setData({
    //       isSave: true
    //     })
    //   }
    //   console.log(res.data.data[0].delFlag )
    // })
  },
  addcards:function(e){
    var that=this
    var openid = app.globalData.openid;
    var isshow=app.globalData.isshow;
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }
  },
  remove:function(){
    var that=this
    var server = app.globalData.server;
    var othercardid=app.globalData.othercardid;
    var groupId = that.data.groupId;
    var openid=app.globalData.openid;
    var cardId=that.data.cardId
    console.log(openid)
    console.log(groupId)
    console.log(cardId)
    util.saveOrUpdate(openid, groupId, 1, cardId).then(function (res) {
      that.setData({
        isSave:false
      })
      wx.switchTab({
        url: '/pages/findmore/findmore',
      })
    })
  },
  back:function(){
    wx.switchTab({
      url: '/pages/findmore/findmore',
    })
  },
  chooseSize:function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  saveToPhone:function(){
    var that=this
    if (that.data.phone) {
      console.log(that.data.phone)
      wx.addPhoneContact({
        firstName: that.data.name,
        mobilePhoneNumber: that.data.phone,
        success: function (a) {
          that.hideModal();
          console.log("保存成功")
          // wx.switchTab({
          //   url: '/pages/findmore/findmore',
          // })
        },fail:function(p){
          console.log(p)
          that.hideModal();
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '该同行名片手机号为空',
        confirmText: '知道了',
        success: function (res) {
          that.hideModal();
          that.setData({
            showModal2: false
          });
        },fail:function(p){
          console.log(p)
          that.hideModal();
        }
      })
    }
  },
  save:function(){
    var that=this
    var server=app.globalData.server;
    var openid=app.globalData.openid;
    var groupId = that.data.groupId;
    var othercardid=app.globalData.othercardid
    var cardId=that.data.cardId
    console.log(cardId)
    util.saveOrUpdate(openid, groupId, 2, cardId).then(function (res) {
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
  backToFind:function(){
    this.hideModal()
    // wx.switchTab({
    //   url: '/pages/findmore/findmore',
    // })
  },
  toTeamPeers:function(e){
    console.log(e)
    var groupId = that.data.groupId;
    var openid=app.globalData.openid;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid='+openid+'&groupid='+groupId,
    })
  },
  onShow(){
    this.onLoad()
  }

})