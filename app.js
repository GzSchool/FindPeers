//app.js
var util=require('/utils/util.js');
const industry = require('/utils/industry.js')
App({
  globalData: {
    notadd:false,
    isshow:"",
    openid:"",
    isgroup:false,               //是不是群
    othercardid: '',             //点击别人分享的别人的id
    canSee:"",                   //群名片里的自己的信息是不是已经分享
    login: '',                   //登陆标识
    // server: 'http://192.168.2.123:8080',
    server: 'https://www.eqxuan.cn',
    urlOfLogin:'/user/userAuthor',               //登录接口
    urlOfAddOrUpdate: '/userCard/saveOrUpdate',  //添加或修改个人信息接口
    urlOfGetCardByOpenID: '/userCard/findOneByOpenId', //获取当前用户信息
    industry:industry,
    groupId:"",
    checkSave:"",
  },
  onLaunch: function(ops) {
    var that = this
    var server = that.globalData.server
    var url = that.globalData.urlOfLogin
    //要是有id 说明点击的别人分享的（只有两个 一是：群里点击的， 二是：别人分享的）
    if (ops.othercardid) {
      that.globalData.othercardid = ops.othercardid;
      var othercardid = ops.othercardid;
      if (ops.scene == 1044) {                                            // 等于这个 就是群里点击的
        that.globalData.isgroup=true
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
                that.globalData.openid = data
                var openid = that.globalData.openid
              }
              var openid = that.globalData.openid;                  //用用户标识访问数据库获取用户信息
              var othercardid = that.globalData.othercardid;
              util.checkSave(openid,othercardid).then(function(a){
                console.log(a)
                if (a.data.data) {
                  that.globalData.checkSave = true
                } else {
                  that.globalData.checkSave = false
                }
              })
              var othercardid = that.globalData.othercardid;              
              util.getCardsById(othercardid).then(function (card) {
                console.log(res)
                console.log(that.globalData.openid)
                console.log(card.data.data[0].openId)
                console.log(encryptedData)
                console.log(iv)
                wx.request({
                  method: 'POST',
                  url: server + '/userGroup/saveOrUpdate',

                  data: {
                    openId: that.globalData.openid,
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
              util.getMyData(openid).then(function (res) {
                // console.log(this.globalData.isshow)         
                console.log(res)
                if (res) {                                         //判断是否返回 有返回值就是已经添加过信息
                  that.globalData.isshow = true
                  that.globalData.notadd = false
                  // wx.navigateTo({
                  //   url: '/pages/peerscards/peerscards?isshow=true&groupId=' + that.globalData.groupId,
                  // })
                  wx.navigateTo({
                    url: '/pages/peerscards/peerscards?isshow=true',
                  })
                } else {
                  that.globalData.notadd = true
                  that.globalData.isshow = false
                  // wx.navigateTo({                                //说明没有添加过名片信息
                  //   url: '/pages/peerscards/peerscards?groupId=' + that.globalData.groupId,
                  // })
                  wx.navigateTo({
                    url: '/pages/peerscards/peerscards?isshow=true',
                  })
                }
              })
              
              // wx.request({
              //   method: 'POST',
              //   url: server + '/userGroup/saveOrUpdate',

              //   data: {
              //     openId: openid,
              //     encryptedData: encryptedData,
              //     iv: iv
              //   },

              //   header: {
              //     'content-type': 'application/json'
              //   },
              //   success: function (c) {
              //     console.log(c)
              //   }
              // })
            })           
          }
        })        
      } else {                                             //点击的个人的分享
        console.log("2222222222222")
        var that = this
        that.globalData.isgroup=false
        var othercardid = that.globalData.othercardid
        util.Login(url).then(function (data) {                     // 登录
          console.log(data)
           if (data) {
            that.globalData.openid = data
             var openid = that.globalData.openid
          }
          var openid = that.globalData.openid;                      //用用户标识访问数据库获取用户信息
          util.checkSave(openid, othercardid).then(function (a) {
            if(a.data.data){
              that.globalData.checkSave=true
            }else{
              that.globalData.checkSave = false
            }
          })
          util.getMyData(openid).then(function (res) {                          
            console.log(res)
            if (res) {
              that.globalData.isshow = true
              that.globalData.notadd = false
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?othercardid=' + othercardid + '&isshow=true',
              })
            } else {
              that.globalData.notadd = true
              that.globalData.isshow = false
              wx.navigateTo({
                url: '/pages/peerscards/peerscards',
              })
            }
          })
        })
      }
    } else {             
      util.Login(url).then(function (data) {                // 登录
        console.log(data)
        if (data) {
          that.globalData.openid = data
          var openid = that.globalData.openid
          console.log(that.globalData.openid)
        }
        var openid = that.globalData.openid;              //用用户标识访问数据库获取用户信息
      var openid = that.globalData.openid;
      console.log(openid)
        util.getMyData(openid).then(function (res) {
          console.log(openid)                                         
          console.log(res)
          if(res){
            that.globalData.notadd = false;
            that.globalData.isshow = true;
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }else{
            that.globalData.notadd = true;
            that.globalData.isshow = false;            
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
          if (that.employIdCallback) {
            that.employIdCallback(res)
          }
        })
      })
    }
    // 热更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }
})