//app.js
var util=require('/utils/util.js');
const industry = require('/utils/industry.js')
App({
  globalData: {
    appOPS: '',     // app.js路由参数
    notadd: false,
    QRCode:"",
    openid: '',
    userImage:"",       //用户头像
    userImg:"",         //用户头像
    othercardid: '',    //点击别人分享的别人的id
    industry: industry, // 行业数据
    server: 'https://www.eqxuan.cn',
    urlOfLogin:'/user/userAuthor',           //登录接口
    urlOfAddOrUpdate: '/userCard/saveOrUpdate',  //添加或修改个人信息接口
    urlOfGetCardByOpenID: '/userCard/findOneByOpenId', //获取当前用户信息
  },
  onLaunch: function (ops) {
    let that = this
    var openid = wx.getStorageSync('openid');
    if (openid) {
      that.globalData.openid = openid
    }
    this.login()
  },
  onShow: function (ops) {
    this.globalData.appOPS = ops
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
    let that = this
    wx.getSetting({
      success: function (e) {
        if (e.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userImage = res.userInfo.avatarUrl
            }
          })
        } else {
          that.globalData.userImage = ""
        }
      }, fail: function (e) {
        that.globalData.userImage = ""
        console.log(e)
      }
    })
  },
  onHide: function () {
    this.globalData.appOPS = ''
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  // 登录获取openid
  login() {
    let that = this
    let url = this.globalData.urlOfLogin
    util.Login(url).then(function (data) {
      console.log('---------' + data)
      if (data) {
        that.globalData.openid = data
        wx.setStorageSync('openid', that.globalData.openid);
        that.getUserData(data)
      } else {
        wx.clearStorage()
      }
    })
  },
  // 使用用户标识访问数据库获取用户信息
  getUserData(openid) {
    let that = this
    util.getMyData(openid).then(function (res) {
      console.log("333333333333333333333")
      console.log(res)
      if (res) {
        that.globalData.notadd = false;
        that.globalData.userImg = res.userImg;
        wx.setStorage({
          key: 'userInfo',
          data: res
        })
        let userPhotoUrl = "";
        if(that.globalData.userImage){
          userPhotoUrl = that.globalData.userImage
        }else{
          userPhotoUrl = res.userImg;
        }
        let page = "pages/peerscards/peerscards";
        let scene = res.id;
        console.log(scene)
        util.makeWxQrCode(userPhotoUrl, scene, page, openid).then(function (res) {
          if (res.data.success) {
            that.globalData.QRCode = ("http://www.eqxuan.cn/" + openid + ".png")            
          } else {
            that.globalData.QRCode = ""
          }  
        })
      } else {
        // 登录失败清空本地缓存
        that.globalData.QRCode="";
        wx.clearStorage()
        that.globalData.notadd = true;
      }
    })
  },
  // 查询红点
  queryRedDot() {
    util.getUserGroupById(this.globalData.openid).then(function (res) {
      let len = res.data.data.length
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          if (res.data.data[i].hint == 1) {
            wx.showTabBarRedDot({
              index: 1,
            })
          }
        }
      }
    })
  }
})