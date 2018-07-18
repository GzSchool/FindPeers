Page({
  globalData: {
    session_Key: null,
    userInfo:null
  },
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: function (r) {
              var code = r.code
          wx.getUserInfo({
            success: function (res) {
              wx.request({
                url: 'http://localhost:8080/wechat/wechat/login',
                method: 'GET',
                data: {
                  encryptedData: res.encryptedData, 
                  iv: res.iv,
                  code
                },

                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res)
                  
                  wx.navigateTo({
                    url: '/pages/first/first',
                  })
                }
              })              
            }
          })
          
            }
          })
        }
      },
      fail:function(){

      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.login({
        success: function (r) {
          //获取到微信的登录凭证code
          var code = r.code
      //插入登录的用户的相关信息到数据库
      wx.getUserInfo({
        success: function (res) {
          //请求自己的服务器,解密用户信息，获取unionId
          wx.request({
            url: 'http://localhost:8080/wechat/user/login',
            method: 'GET',//get,del
            herder: {
              'content-type': 'json'
            },
            //请求的参数data
            data: { encryptedData: res.encryptedData, iv: res.iv, code, nickName: res.userInfo.nickName, country: res.userInfo.country, province: res.userInfo.province, city: res.userInfo.city, language: res.userInfo.language },
            success: function (data) {
              that.globalData.session_key=data.data.userInfo.session_key;
              //判断是否解密成功
              if (data.data.status == 1) {
                var userInfo_ = data.data.userInfo;
                wx.navigateTo({
                  url: '/pages/first/first',
                })
              } else {
                console.log('解密失败1')
              }

            },
            fail: function () {
              console.log('系统错误')
            }
          })

        },
        fail: function () {
          console.log("获取用户信息失败")
        }
      })
        } 
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
      
    }
    
  },
failToget:function(e){
  wx.navigateTo({
    url: '/pages/fail/fail',
  })
}
})