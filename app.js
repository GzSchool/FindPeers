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
    checkSave:"",                //判断当前用户是否已保存其他用户
    addPhone:"",                 //判断是否已添加手机号
    appOPS: '',     // app.js路由参数
  },
  onLaunch: function(ops) {
    this.globalData.appOPS = ops
    console.log('app.onlaunch ops')
    console.log(ops)
    // 登录
    var that = this
    let url = that.globalData.urlOfLogin
    util.Login(url).then(function (data) {
      if (data) {
        that.globalData.openid = data
        var openid = that.globalData.openid
      }
      // 用用户标识访问数据库获取用户信息
      var openid = that.globalData.openid;  
      util.getMyData(openid).then(function (res) {
        if (res) {
          if (res.userPhone) {
            that.globalData.addPhone = true
          } else {
            that.globalData.addPhone = false
          }
          that.globalData.notadd = false;
          that.globalData.isshow = true;
        } else {
          that.globalData.addPhone = false
          that.globalData.notadd = true;
          that.globalData.isshow = false;
        }
        if (that.employIdCallback) {
          that.employIdCallback(res)
        }
      })
    })
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