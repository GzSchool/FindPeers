//app.js
App({
  data:{
    openid:'',
    ishsow:''
  },
  onLaunch: function (ops) {
    var id = ops.id
    if(id){                            //要是有id 说明点击的别人分享的（只有两个 一是：群里点击的， 二是：别人分享的）
    if(ops.scene==1044){               // 等于这个 就是群里点击的
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
          var jsCode=res.code;
          wx.request({
            method: 'GET',
           // url: 'http://192.168.2.150:8766/weChatAuth/authorize',
            
            data: {
              jsCode:res.code
            },
            
            header: {
              'content-type': 'application/json'
            },
            success: function (a) {                                      //后台获取openid
              console.log(a);
              var openid = a.data.data.openId;
                                                                        //用openId向后台获取是不是在后台
              wx.request({
                method: 'GET',
                //url: 'http://192.168.2.150:8766/userCard/findOne',
                
                data:{
                 openid:a.data.data.openId
                },
                header: {
                  'content-type': 'application/json'
                },
                success:function(b){  
                  console.log(b)
                  if(b.data.userId){                                      //要是返回了id 那就是已经授权了
                  var userId=b.data.userId;
                  wx.request({
                    method: 'GET',
                   // url: 'http://192.168.2.150:8766/user/findById',

                    data: {
                      userId :b.data.userId
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success:function(c){
                      var id=this.data.id;
                      if(c.data.wechatNum){                             //说明已经添加过信息了
                        wx.redirectTo({
                          url: '/pages/peerscards/peerscards?id=id?isshow=true',
                        })
                      }else{
                        wx.redirectTo({
                          url: '/pages/peerscards/peerscards?id=id&isshow=false',
                        })
                      }
                    },
                    fail:function(){
                      console.log("出错了")
                    }
                  })
                    
                  }else{                  //否则 说明没有授权
                  var id=this.data.id
                  var openid=
                    wx.redirectTo({
                      url: '/pages/index/index?openId=openid&id=id',
                    })
                  }
                },
                fail: function () {
                  console.log("用openId获取失败1")
                }
              })
            },
            fail: function () {
              console.log("获取openId失败1")
            }
          })
        }
      },
      fail: function () {
        console.log("登录失败1")
      }
    })
    }else{                                //点击的个人的分享
      wx.login({
        success:function(a){
          if(a.code){
            var jsCode = a.code;
            wx.request({
              method: 'GET',
             // url: 'http://192.168.2.150:8766/weChatAuth/authorize',
              data: {
                jsCode
              },
              header: {
                'content-type': 'application/json'
              },
              success:function(b){
                var openId=b.data.data.openId;
                wx.request({
                  method: 'GET',
                 // url: 'http://192.168.2.150:8766/userCard/findOne',
                  data: {
                    openId: b.data.data.openId
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success:function(c){
                    if(c.data.userId){           //要是有返回的用户Id 说明已经授权
                      wx.request({
                        method: 'GET',
                        url: 'http://192.168.2.150:8766/user/findById',

                        data: {
                          userId
                        },
                        header: {
                          'content-type': 'application/json'
                        },
                        success: function (c) {
                          if (c.data.wechatNum) {                             //说明已经添加过信息了
                            wx.redirectTo({
                              url: '/pages/peerscards/peerscards?id=id',
                            })
                          } else {
                            wx.redirectTo({
                              url: '/pages/peerscards/peerscards?id=id&isshow=false',
                            })
                          }
                        },
                        fail: function () {
                          console.log("出错了")
                        }
                      })
                    }else{                      //要是没有返回 说明没有授权
                      var openid = b.data.data.openId;
                      wx.redirectTo({
                        url: '/pages/index/index?openid=openid&id=id',
                      })
                    }
                  },
                  fail:function(){
                    console.log("用openId获取失败2")
                  }
                })
              },
              fail:function(){
                console.log("获取openId失败2")
              }
            })
          }
        },
        fail:function(){
          console.log("登录失败2")
        }
      })
    }
  }else{               //搜索小程序点击小程序的
    wx.login({
      success:function(a){
        if(a.code){
          var jsCode=a.code;
          wx.request({
            method:'GET',
           // url: 'http://192.168.2.150:8766/weChatAuth/authorize',
            data:{
              jsCode
            },
            header: {
              'content-type': 'application/json'
            },
            success:function(b){ 
              console.log(b)                 //用code 获取openid
              var openid=b.data.data.openId;
              console.log(openid)
              wx.request({
                method: 'GET',
               // url: 'http://192.168.2.150:8766/userCard/findOne',
                data: {
                  openid: b.data.data.openId
                },
                header: {
                  'content-type': 'application/json'
                },
                success:function(c){
                  console.log(c)              //用openId 获取userid 要是有userid 说明 已经授权了
                  if(c.data.userId){
                    var id= c.data.userId;
                    wx.request({
                      method: 'GET',
                     // url: 'http://192.168.2.150:8766/user/findById',
                      data: {
                        id:c.data.userId
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      success:function(d){              //说明已经填写过自己的
                        if(d.data.wechatNum){
                          wx.redirectTo({
                            url: '/pages/mine/mine?id=id',
                          })
                        }else{
                          wx.redirectTo({
                            url: '/pages/findmore/findmore?id=id',  //说明没有添加过信息
                          })
                        }
                      }
                    })
                  }else{                    //没有返回userId说明没有授权
                    wx.redirectTo({
                      url: '/pages/index/index?openid=openid',
                    })
                  }
                },fail:function(){
                  console.log("openId查询失败3")
                }
              })
            },
            fail: function () {
              console.log("获取openId失败3")
            }
          })
        }
      },
      fail: function () {
        console.log("登录失败3")
      }
    })
  }
  }
})
