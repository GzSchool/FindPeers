//app.js
App({
  onLaunch: function () {
    var _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 登陆成功
        console.log(res)
        if (res.code) {
          // 发起网络请求，获取微信信息
          console.log(res.code);
          var code=res.code;
          wx.request({
            method: 'GET',
            url: 'http://localhost:8080/wechat/user/login',
            
            data: {
              code
            },
            
            header: {
              'content-type': 'application/json'
            },
            success: function (res) { //后台获取openid
              console.log(res);
              var openid = res.data.openid;
              //用openId向后台获取获取是不是在后台
              wx.request({
                method: 'GET',
                url: 'http://localhost:8080/wechat/user/getById',
                
                data:{
                 openId:res.data.openid
                },
                header: {
                  'content-type': 'application/json'
                },
                success:function(res){  
                  console.log(res)
                  if(res.data.name){   //要是返回了名字 那就是已经授权了
                    
                  }else{
                    wx.navigateTo({
                      url: '',
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
    
  }
})
