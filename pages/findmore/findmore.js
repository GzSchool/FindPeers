// pages/findmore/findmore.js
var app = getApp();
import { validateUpperCase } from '../../utils/validate.js'
var util = require('../../utils/util.js');
Page({
  data: {
    name: '',        //用户名字
    wechatnum: '',   //用户微信号
    company: '',     //用户公司
    idustry: '',     //用户行业
    city: '',        //用户城市
    email: '',       //用户邮箱
    phone: '',       //用户手机号
    image: '',       //用户头像
    job: '',         //用户职务 
    openid: '',      //用户标识
    notadd: false,   //是否未添加信息
    list: [],        //存储收到的同行信息
    list_length: 0,  // 一共保存多少张
    scrollTop: 0,     //滚动菜单
    screenHeight: '', //滚动菜单高度 
    list_con: [],    // 同行数据列表
    topNum: 0,       // 距离顶部高度
    list_id: '',     // 锚点
    list_letter: [],    // 锚点列表
    floorstatus: false, // 回到顶部
  },
  onLoad: function (a) {
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        if(res.data){
          app.globalData.notadd = false
        that.setData({
          name: res.data.username,
          wechatnum: res.data.userWechat,
          company: res.data.userCompany,
          idustry: res.data.userIndustry,
          city: res.data.userCity,
          email: res.data.userEmail,
          phone: res.data.userPhone,
          image: res.data.userImg,
        })
        }else{
          app.globalData.notadd = true
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
    wx.getStorage({
      key: 'list_con',
      success: function(res) {
        console.log(res)
        that.setData({
          list_con: res.data
        })
      }
    })
    wx.getStorage({
      key: 'list_letter',
      success: function (res) {
        console.log(res)
        that.setData({
          list_letter: res.data
        })
      },
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    var url = app.globalData.urlOfLogin
    // 登录获取openid
    util.Login(url).then(function (data) { 
      if (data) {
        app.globalData.openid = data
      }
      var openid = app.globalData.openid;  
      // 使用用户标识访问数据库获取用户信息
      util.getMyData(openid).then(function (res) {
        if (res) {
          res.userPhone?app.globalData.addPhone = true:app.globalData.addPhone = false
          app.globalData.notadd = false;
          wx.getStorage({
            key: 'userInfo',
            success: function (args) {
              wx.setStorage({
                key: 'userInfo',
                data: res,
              })
            },
            fail: function (args) {
              wx.setStorage({
                key: 'userInfo',
                data: res
              })
            }
          })
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
        } else {
          // 登录失败清空本地缓存
          wx.clearStorage()
          app.globalData.addPhone = false
          app.globalData.notadd = true;
          that.setData({
            notadd: true
          })
        }
        if (that.employIdCallback) {
          that.employIdCallback(res)
        }
      })
    })
    // 获取屏幕高度 scrollview
    if (this.data.screenHeight == '') {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            screenHeight: res.windowHeight
          })
        },
      })
    }
    // 等待app.onlaunch执行完之后加载页面
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
  // 获取同行数据
  getData() {
    var that = this;
    that.setData({
      notadd: app.globalData.notadd,
      openid: app.globalData.openid
    })
    var openid = app.globalData.openid;
    // 获取当前保存的同行名片
    util.getMyPeers(openid).then(function (res) { 
      if (res.data.data.length == 0 || !res.data.data.length) {
        wx.removeStorage({
          key: 'list_con',
          success: function (res) {
            console.log(res.data)
          }
        })
        wx.removeStorage({
          key: 'list_letter',
          success: function (res) {
            console.log(res.data)
          }
        })
      }
      // let val = JSON.stringify(res.data.data) == JSON.stringify(that.data.list)
      let letter = [];
      let con = [];
      var length = res.data.data.length;
      if (length) {
        that.setData({
          list_length: length
        })
      }
      for (let i = 0; i < length; i++) {
        // letter.push(res.data.data[i].prepare.slice(0, 1))
        if (res.data.data[i].prepare && validateUpperCase(res.data.data[i].prepare.slice(0, 1))) {
          letter.push(res.data.data[i].prepare.slice(0, 1))
        }
      }
      for (let i = 0; i < length; i++) {
        if (res.data.data[i].prepare == null || !validateUpperCase(res.data.data[i].prepare.slice(0, 1))) {
          letter.push('xx')
        }
      }
      letter = that.dedupe(letter)
      let len = letter.length;
      letter.forEach(function (a, b) {
        con[b] = { letter: a, data: [] }
        res.data.data.forEach(function (c, d) {
          if (a == c.prepare.slice(0, 1)) {
            con[b].data.push(c)
          }
        })
      })
      res.data.data.forEach(function (c, d) {
        if (!validateUpperCase(c.prepare.slice(0, 1))) {
          con[len-1].data.push(c)
        }
      })
      that.setData({
        list: res.data.data,
        list_letter: letter,
        list_con: con,
      })
      wx.setStorage({
        key: 'list_con',
        data: that.data.list_con,
      })
      wx.setStorage({
        key: 'list_letter',
        data: that.data.list_letter,
      })
    });
  },
  // 企业详情
  trans: function () {
    wx.navigateTo({
      url: '/pages/company/company',
    })
  },
  // 查看我的名片
  mycards: function () {
    var openid = app.globalData.openid
    wx.navigateTo({
      url: '/pages/mycards/mycards?openid=' + openid,
    })
  },
  // 添加个人信息按钮
  addcards: function (e) {
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
  // 搜索页面
  bindtrans: function () {
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  // 查看名片详情
  select: function (a) {
    // var otheropenid = a.currentTarget.dataset.key;
    // var saveFlag = a.currentTarget.dataset.saveflag;
    var cardId = a.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=0&saveFlag=2',
    })
  },
  onShow: function () {
    this.onLoad();
  },
  // es6数组去重方法
  dedupe:function (array) {
    return Array.from(new Set(array))
  },
  // 获取滚动条当前位置
  scrolltoupper: function (e) {
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
  // 点击锚点
  letterClick(e) {
    this.setData({
      list_id: e.target.dataset.item
    });
  },
  // 点击返回顶部
  goTop() {
    this.setData({
      topNum: 0
    })
  },
  // 分享
  onShareAppMessage: function (a) {               //转发
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(a)
        console.log(res)
        // 转发失败
      }
    }
  }
})