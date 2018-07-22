var app=getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: "",
    otheropenid:'',
    isshow: "",
    other:''
  },
  onLoad: function (ops) {
    var that=this
    that.data.otheropenid=app.globalData.otheropenid;
    that.data.openid=app.globalData.openid;
    console.log(that.data.otheropenid)
    console.log(that.data.openid)    
    if(ops.other){
      that.setData({
        other:ops.other
      })
    }
  },
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      console.log('000')
      //用户按了允许授权按钮
      wx.showModal({
        content: "授权成功，第一次登陆请先修改个人信息",
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          app.globalData.login=true
          if (that.data.otheropenid != null) {
            var otheropenid = app.globalData.otheropenid;
            var openid=that.data.openid;
            console.log(otheropenid)
            var other=that.data.other
            if(other){
            wx.redirectTo({
              url: '/pages/addcards/addcards?otheropenid=' + otheropenid+'&other=true',
            })
            }else{
              wx.redirectTo({
                url: '/pages/addcards/addcards?otheropenid=' + otheropenid,
              })
            }
          } else {
            var openid = that.data.openid;
            console.log(openid)
            wx.redirectTo({
              url: '/pages/addcards/addcards?openid=' + openid,
            })
          }
        }
      })
    } else {
      wx.showModal({
        content: "您已拒绝授权",
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          that.setData({
            showModal2: false
          });
          app.globalData.login=false;
          console.log(app.globalData.login)
          var otheropenid = app.globalData.otheropenid;
          console.log(otheropenid)          
          if (otheropenid) {
            console.log(otheropenid)
            wx.redirectTo({
              url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid,
            })
          }else{
            app.globalData.notadd=false
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
        }
      })
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
                  url: '/pages/peerscards/peerscards?otheropenid='+otheropenid+'&ishow=false',
                })
              }
            }
          })
        }
      }
    })*/
  }
})