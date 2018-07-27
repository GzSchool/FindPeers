//app.js
const industry = require('./utils/industry.js')
App({
  industry: industry,
  globalData: {
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
    server: 'http://192.168.2.213:8080'
  },
  onLaunch: function(ops) {
    var that = this
    var server = that.globalData.server
    var othercardid = that.globalData.othercardid
    //要是有id 说明点击的别人分享的（只有两个 一是：群里点击的， 二是：别人分享的）
    if (othercardid !== "" && othercardid !== null) {
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

        wx.login({
          success: res => { // 发送 res.code 到后台换取 openId, sessionKey,unionId
            // 登陆成功
            console.log(res)
            if (res.code) {
              // 发起网络请求，获取微信信息
              console.log(res.code);
              var code = res.code;
              wx.request({
                method: 'GET',
                url: server + '/user/userAuthor',

                data: {
                  code: res.code
                },

                header: {
                  'content-type': 'application/json'
                },
                success: function(a) { //后台获取openid
                  console.log(a);
                  var openid = a.data.data.openId;
                  that.globalData.openid = a.data.data.openId
                  var openid = that.globalData.openid;
                  var openid = that.globalData.openid;
                  console.log(openid)
                  wx.request({
                    method: 'GET',
                    url: server + '/userCard/findOneByOpenId',
                    data: {
                      openId: openid
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(c) {
                      console.log(c)
                      if (c.data.data !== null || c.data.data !== "") { //返回值不空 说明有添加过信息
                        var othercardid = that.globalData.othercardid
                        that.globalData.isshow = true
                        that.globalData.notadd = false
                        wx.redirectTo({
                          url: '/pages/peerscards/peerscards?isshow=true',
                        })
                        /* wx.switchTab({
                           url: '/pages/findmore/findmore',
                         })*/
                      } else {
                        that.globalData.notadd = true
                        that.globalData.isshow = false
                        wx.redirectTo({ //说明没有添加过名片信息
                          url: '/pages/peerscards/peerscards',
                        })
                      }
                    }
                  })
                },
                fail: function() {
                  console.log("获取openId失败1")
                }
              })
            }
          },
          fail: function() {
            console.log("登录失败1")
          }
        })
      } else { //点击的个人的分享
        console.log("2222222222222")
        var that = this
        var othercardid = that.globalData.othercardid
        wx.login({
          success: function(a) {
            if (a.code) {
              var code = a.code;
              console.log(code)
              wx.request({
                method: 'GET',
                url: server + '/user/userAuthor',
                data: {
                  code: a.code
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(b) {
                  var openId = b.data.data.openId; //获取自己的openId
                  console.log(openId)
                  that.globalData.openid = b.data.data.openId;
                  var openid = that.globalData.openid;
                  console.log(openid)
                  wx.request({
                    method: 'GET',
                    url: server + '/userCard/findOneByOpenId',
                    data: {
                      /*openId: b.data.data.openId*/
                      openId: openid
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(c) {
                      console.log(c)
                      var othercardid = that.globalData.othercardid
                      var openid = that.globalData.openid;
                      console.log(c.data.data == null)
                      if (c.data.data !== null && c.data.data !== "") { //要是有返回的 说明已经添加过信息
                        that.globalData.isshow = true
                        that.globalData.notadd = false
                        console.log("isshow")
                        wx.redirectTo({
                          url: '/pages/peerscards/peerscards?othercardid=' + othercardid + '&isshow=true',
                        })
                        /*wx.switchTab({
                          url: '/pages/findmore/findmore',
                        })  */
                      } else { //要是没有返回 说明没有添加过信息
                        console.log("notshow")
                        that.globalData.notadd = true
                        that.globalData.isshow = false
                        wx.redirectTo({
                          url: '/pages/peerscards/peerscards',
                        })
                      }
                    },
                    fail: function() {
                      console.log("用openId获取失败2")
                    }
                  })
                },
                fail: function() {
                  console.log("获取openId失败2")
                }
              })
            }
          },
          fail: function() {
            console.log("登录失败2")
          }
        })
      }
    } else {                                                     //搜索小程序点击小程序的
      console.log("333333333333333")
      var that=this
      wx.login({
        success: function(a) {
          var code = a.code;
          console.log(code)
          if (code) {
            wx.request({
              method: 'GET',
              url: server + '/user/userAuthor',
              data: {
                code: a.code
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(b) {
                console.log(b) //用code 获取openid
                var openid = b.data.data.openId;
                that.globalData.openid = b.data.data.openId;
                console.log(openid)
                var openid = that.globalData.openid

                wx.request({
                  method: 'GET',
                  url: server + '/userCard/findOneByOpenId',
                  data: {
                    /*openId: b.data.data.openId*/
                    openId:openid
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function(d) {
                    console.log(d)
                    var openid = that.globalData.openid;
                    console.log(openid)
                    if (d.data.data !== null) { //返回了 说明已经添加过信息了
                      console.log(d.data.data.userWechat)
                      console.log("isadd")
                      that.globalData.notadd = false;
                      console.log(that.globalData.notadd)
                      that.globalData.isshow = true;
                      console.log(that.globalData.notadd)
                      wx.switchTab({
                        url: '/pages/findmore/findmore',
                      })
                    } else { //没有返回 说明没有添加
                      that.globalData.notadd = true;
                      wx.switchTab({
                        url: '/pages/findmore/findmore',
                      })
                    }
                  }
                })

              },
              fail: function() {
                console.log("获取openId失败3")
              }
            })


          }

        },
        fail: function() {
          console.log("登录失败3")
        }
      })
    }
  }
})