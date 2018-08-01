//app.js
var util=require('/utils/util.js');
const industry = require('/utils/industry.js')
App({

  globalData: {
    refreshFlag: false,
    industry: industry,           // 行业数据                     
    openid: '',                     //当前用户标识
    isshow: false,                 //是否能看別人信息
    notadd: true,                 //是否沒有添加個人信息
    groupid: '',                  //群标识
    mycardid: '',                    //自己的cardid 
    isgroup:false,               //是不是群
    othercardid: '',             //点击别人分享的别人的id
    canSee:"",                   //群名片里的自己的信息是不是已经分享
    login: '',                   //登陆标识
    // server: 'http://localhost:8080',                 //服务器地址
    server: 'http://192.168.2.123:8080',
    urlOfLogin:'/user/userAuthor',                    //登录接口
    urlOfAddOrUpdate: '/userCard/saveOrUpdate',       //添加或修改个人信息接口
    urlOfGetCardByOpenID: '/userCard/findOneByOpenId', //获取当前用户信息
  },
  onLaunch: function(ops) {
    var that = this
    var server = that.globalData.server
    var othercardid = that.globalData.othercardid
    var url = that.globalData.urlOfLogin
    //要是有id 说明点击的别人分享的（只有两个 一是：群里点击的， 二是：别人分享的）
    if (othercardid) {
      that.globalData.othercardid=ops.cardId
      if (ops.scene == 1044) {                                            // 等于这个 就是群里点击的
        that.globalData.isgroup=true
        var shareTickets = ops.shareTicket;
        console.log(ops.shareTicket)                                      //群里点击的回带shareTickets可以用这个获取groupid
        wx.getShareInfo({
          shareTicket: shareTickets,
          success: function(res) {
            console.log(res)
            console.log()
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
        // 登录
        util.Login(url).then(function (data) {
          if (data) {
            that.globalData.openid = data
            var openid = that.globalData.openid
          }
          var openid = that.globalData.openid;                  //用用户标识访问数据库获取用户信息
          util.getMyData(openid).then(function (res) {  
            console.log('登录返回值')  
            // console.log(this.globalData.isshow)         
            console.log(res)
            if (res) {                                //判断是否返回 有返回值就是已经添加过信息
              that.globalData.isshow = true
              that.globalData.notadd = false
              wx.redirectTo({
                url: '/pages/peerscards/peerscards?isshow=true',
              })
            } else {
              that.globalData.notadd = true
              that.globalData.isshow = false
              wx.redirectTo({                                //说明没有添加过名片信息
                url: '/pages/peerscards/peerscards',
              })
            }
          })
        })
      } else {                                             //点击的个人的分享
        console.log("2222222222222")
        var that = this
        var othercardid = that.globalData.othercardid
        util.Login(url).then(function (data) {                     // 登录
          console.log(data)
          if (data) {
            that.globalData.openid = data
            var openid = that.globalData.openid
          }
          var openid = that.globalData.openid;                      //用用户标识访问数据库获取用户信息
          util.getMyData(openid).then(function (res) {                          
            console.log(res)
            if (res) {
              that.globalData.isshow = true
              that.globalData.notadd = false
              wx.redirectTo({
                url: '/pages/peerscards/peerscards?othercardid=' + othercardid + '&isshow=true',
              })
            } else {
              that.globalData.notadd = true
              that.globalData.isshow = false
              wx.redirectTo({
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
          // console.log(that.globalData.openid)
        }
        var openid = that.globalData.openid;                //用用户标识访问数据库获取用户信息
        util.getMyData(openid).then(function (res) {                               
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
  },
  showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }
})