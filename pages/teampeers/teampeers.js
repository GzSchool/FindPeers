// pages/teampeers/teampeers.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    groupid: "",
    list: [],
    name: "",
    job:"",
    qunname:"格致文化",
    server: "",
    cansee: false,
    city: "",
    key: "按微信号，城市，行业搜索",
    industry: "",
    company: "",
    phone: "",
    wechatnum: "",
    emai: "",
    image: "/pages/images/1.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    var that = this
    that.setData({
      server: app.globalData.server,
      openid: ops.openid,
      groupid: ops.groupid
    })
    var list = that.data.list;
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server + '/userGroup/findGroupCards',
      data: {
        openId: that.data.openid,
        groupId: that.data.groupid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        var length = b.data.data.length
        for (var i = 0; i < length; i++) {
          list.push(b.data.data[i]);
        }
        console.log(list)
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        });
      }
    })
    wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',

      data: {
        openId: that.data.openid
      },

      header: {
        'content-type': 'application/json'
      },
      success: function (c) {
        console.log(c)
        that.setData({
          name: c.data.data.username,
          wechatnum: c.data.data.userWechat,
          company: c.data.data.userCompany,
          job:c.data.data.userJob,
          industry: c.data.data.userIndustry,
          city: c.data.data.userCity,
          email: c.data.data.userEmail,
          phone: c.data.data.userPhone,
          //image: c.data.data.userImg,
        })
      }
    })
  },
  share: function () {
    var that = this
    var openid = this.data.openid
    var groupid = this.data.groupid
    var server = that.data.server
    wx.showModal({
      title: '分享到本群',
      content: '确定分享到本群',
      success: function (r) {
        if (r.confirm) {
          wx.request({
            method: 'GET',
            url: server + '/userGroup/saveOrUpdate',

            data: {
              openId: openid,
              groupId: groupid
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (a) {
              console.log(a)
              that.setData({
                cansee: true
              })
            }
          })
        }
      }
    })
  },
  mycards: function () {
    wx.navigateTo({
      url: '/pages/mycards/mycards',
    })
  },
  checkboxChange: function (a) {
    if(a.type=="change"){

    }
    console.log(a)
    
  },
  check:function(a){
  }
})