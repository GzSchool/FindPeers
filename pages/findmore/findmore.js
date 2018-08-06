// pages/findmore/findmore.js
var app = getApp();
import { validateUpperCase } from '../../utils/validate.js'
var util = require('../../utils/util.js');
Page({
  data: {
    name: '',        //用户名字
    job: '',         //用户职务 
    wechatnum: '',   //用户微信号
    othercardid: "", //分享的人的标识
    company: '',     //用户公司
    openid: '',      //用户标识
    notadd: false,   //是否未添加信息
    idustry: '',     //用户行业
    city: '',        //用户城市
    email: '',       //用户邮箱
    phone: '',       //用户手机号
    image: '',       //用户头像
    server: "",      //服务器地址
    list: [],        //存储收到的同行信息
    hidden: true,
    scrollTop: 0,    //滚动菜单
    screenHeight: '', //滚动菜单高度 
    key: " 微信号、城市、公司、行业等进行搜索",   //搜索框值
    list_letter: [],
    list_con: [],
    list_id: '',
    floorstatus: false, // 回到顶部
    topNum: 0
  },
  onShareAppMessage: function (a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function (res) {
        console.log("66666666666")
        console.log(res)
        console.log(a)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res)
            console.log(a)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',

              data: {
                openId: app.globalData.openId,
                openId: app.globalData.openId,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                // wx.navigateTo({
                //   url: '/pages/peerscards/peerscards',
                // })
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  },
  onLoad: function (a) {
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight
        })
      },
    })
    console.log(app.globalData.notadd)
    if (app.globalData.openid && app.globalData.openid !== '') {
      this.getData()
    } else {
      app.employIdCallback = employId => {
        if (employId || employId == null) {
          this.getData()
        }
      }
    }
  },
  getData() {
    var that = this;
    that.setData({
      notadd: app.globalData.notadd,
      server: app.globalData.server,
      othercardid: app.globalData.othercardid
    })
    var notadd = app.globalData.notadd;
    that.data.openid = app.globalData.openid;
    var openid = app.globalData.openid;
    util.getMyData(openid).then(function (res) {               //用户查询自己信息
      console.log(res)
      if (!res) {
        that.setData({
          notadd: true
        })
        app.globalData.notadd = true
      } else {
        app.globalData.notadd = false
        app.globalData.isshow = true
        that.setData({
          name: res.username,
          wechatnum: res.userWechat,
          company: res.userCompany,
          idustry: res.userIndustry,
          city: res.userCity,
          email: res.userEmail,
          phone: res.userPhone,
          image: res.userImg,
        })
      }
    })
    var openid = app.globalData.openid;
    var list = that.data.list
    console.log(openid)
    util.getMyPeers(openid).then(function (res) {                         //获取当前保存的同行名片
      console.log('我的同行列表')
      console.log(res.data.data)
      let val = JSON.stringify(res.data.data) == JSON.stringify(that.data.list)
      let letter = [];
      let con = [];
      var length = res.data.data.length;
      for (let i = 0; i < length; i++) {
        letter.push(res.data.data[i].prepare.slice(0, 1))
        // if (validateUpperCase(res.data.data[i].prepare.slice(0, 1))) {
        // }
      }
      // letter.push('#')
      letter = that.dedupe(letter)
      // console.log(letter)
      letter.forEach(function (a, b) {
        con[b] = { letter: a, data: [] }
        res.data.data.forEach(function (c, d) {
          if (a == c.prepare.slice(0, 1)) {
            con[b].data.push(c)
          }
        })
      })
      // console.log(letter)
      that.setData({
        list: res.data.data,
        list_letter: letter,
        list_con: con,
      })
      // console.log(that.data.list_con)
    });
  },
  trans: function () {
    wx.navigateTo({
      url: '/pages/company/company',
    })
  },
  mycards: function () {
    var openid = app.globalData.openid
    wx.navigateTo({
      url: '/pages/mycards/mycards?openid=' + openid,
    })
  },
  peerscards: function () {
    var cardId = currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/othercards/othercards?cardId=' + cardId + '&groupId=0&saveFlg=2',
    })
  },
  addcards: function (e) {
    var othercardid = app.globalData.othercardid;
    console.log(othercardid !== "")
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    } else {
      wx.switchTab({
        url: '/pages/findmore/findmore',
      })
    }
  },
  bindtrans: function () {
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  select: function (a) {
    var otheropenid = a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    var saveFlag = a.currentTarget.dataset.saveflag;
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=0&saveFlag=2',
    })
  },
  onShow: function () {
    this.onLoad();
    let con = []
    let cons = [{letter: '', data: []}]
    console.log(con)
  },
  letterClick(e) {
    this.setData({
      list_id: e.target.dataset.item
    });
    console.log(this.data.list_id)
  },
  dedupe:function (array) {
    return Array.from(new Set(array))
  },
  // 获取滚动条当前位置
  scrolltoupper: function (e) {
    console.log(e.detail.scrollTop)
    if (e.detail.scrollTop > 1000) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop() {
    this.setData({
      topNum: 0
    })
  }
})