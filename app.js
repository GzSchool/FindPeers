//app.js
var util=require('/utils/util.js');
const industry = require('/utils/industry.js')
App({

  globalData: {
    industry: industry,
    openid: '',
    isshow: false,
    notadd: true,
    groupid: '',
    mycardid: '',
    isgroup:false,
    othercardid: '',
    canSee:"",
    login: '',
    server: 'http://localhost:8080',
    server: 'http://192.168.2.123:8080',
    urlOfLogin:'/user/userAuthor'
  },
  onLaunch: function(ops) {
    var that = this
    var server = that.globalData.server
    var othercardid = that.globalData.othercardid
    var url = that.globalData.urlOfLogin
    //要是有id 说明点击的别人分享的（只有两个 一是：群里点击的， 二是：别人分享的）
    if (othercardid !== "" && othercardid !== null) {
      that.globalData.othercardid=ops.cardId
      if (ops.scene == 1044) { // 等于这个 就是群里点击的
        that.globalData.isgroup=true
        var shareTickets = ops.shareTicket;
        console.log(ops.shareTicket)
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
          console.log(data)
          if (data !== "") {
            that.globalData.openid = data
            var openid = that.globalData.openid
          }
          var openid = that.globalData.openid;
          util.getMyData(openid).then(function (res) {
            console.log(res)
            if (res !== null) {
              that.globalData.isshow = true
              that.globalData.notadd = false
              wx.redirectTo({
                url: '/pages/peerscards/peerscards?isshow=true',
              })
            } else {
              that.globalData.notadd = true
              that.globalData.isshow = false
              wx.redirectTo({ //说明没有添加过名片信息
                url: '/pages/peerscards/peerscards',
              })
            }
          })
        })
      } else {                                                       //点击的个人的分享
        console.log("2222222222222")
        var that = this
        var othercardid = that.globalData.othercardid
        util.Login(url).then(function (data) {
          console.log(data)
          if (data !== "") {
            that.globalData.openid = data
            var openid = that.globalData.openid
          }
          var openid = that.globalData.openid;
          util.getMyData(openid).then(function (res) {
            console.log(res)
            if (res !== null) {
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
    } else {                                                     //搜索小程序点击小程序的
      console.log("333333333333333")
      util.Login(url).then(function(data){
        console.log(data)
        if(data!==""){
          that.globalData.openid = data
          var openid = that.globalData.openid
        }
        var openid=that.globalData.openid;
        util.getMyData(openid).then(function(res){
          console.log(res)
          if(res!==null){
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
          })
      })
    }
  }
})