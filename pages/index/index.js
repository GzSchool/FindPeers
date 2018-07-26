var app=getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: "",
    server:"",
    isshow: "",
    other:''
  },
  onLoad: function (ops) {
    var that=this
    that.data.server=app.globalData.server;
    that.data.othercardid = app.globalData.othercardid;
    that.data.openid=app.globalData.openid;
    console.log(that.data.openid)    
  },
  bindGetUserInfo: function (e) {
    var that = this;
    var server = that.data.server
    
    if (e.detail.userInfo) {
      console.log('000')
      //用户按了允许授权按钮
      if (that.data.othercardid != null) {
        var othercardid = app.globalData.othercardid;
            var openid=that.data.openid;
        console.log(othercardid)
        if (othercardid!=""){
            wx.redirectTo({
              url: '/pages/addcards/addcards?othercardid=' + othercardid,
            })
            }else{
              wx.redirectTo({
                url: '/pages/addcards/addcards?openid=' + openid,
              })
            }
          } 
    } else {
        
        
      var othercardid = app.globalData.othercardid;
      console.log(othercardid)          
      if (othercardid!="") {
            wx.redirectTo({
              url: '/pages/peerscards/peerscards?othercardid=' + othercardid,
            })
          }else{
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
    }
    /*wx.login({
      success: function (c) {
        if (c.code) {
          wx.getUserInfo({
            success:function(res){
              if (this.data.otheropenid!=null){
                var otheropenid = this.data.otheropenid;
                console.log(otheropenid)                    
              wx.redirectTo({
                url: '/pages/peerscards/peerscards?otheropenid='+otheropenid,
              })
              }else{
                var openid = this.data.openid;
                console.log(openid)                  
                wx.redirectTo({
                  url: '/pages/addcards/addcards?openid='+openid,
                })
              }
            },
            fail:function(a){
              if (this.data.otheropenid){
                var otheropenid = this.data.otheropenid;
                console.log(otheropenid)                    
                wx.navigateTo({
                  url: '/pages/peerscards/peerscards?otheropenid='+otheropenid+'&isshow=false',
                })
              }
            }
          })
        }
      }
    })*/
  }
})