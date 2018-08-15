// pages/findmore/findmore.js
import pinyin from '../../utils/pinyin.js'
var app = getApp();
import {
  validateUpperCase
} from '../../utils/validate.js'
var util = require('../../utils/util.js');
Page({
  data: {
    name: '', //用户名字
    wechatnum: '', //用户微信号
    company: '', //用户公司
    idustry: '', //用户行业
    city: '', //用户城市
    email: '', //用户邮箱
    phone: '', //用户手机号
    image: '', //用户头像
    job: '', //用户职务 
    openid: '', //用户标识
    notadd: false, //是否未添加信息
    scrollTop: 0, //滚动菜单
    screenHeight: '', //滚动菜单高度 
    list_con: [], // 名片数据列表
    list_length: 0, // 一共保存多少张
    topNum: 0, // 距离顶部高度
    list_id: '', // 锚点
    list_letter: [], // 锚点列表
    floorstatus: false, // 回到顶部
  },
  onLoad: function(a) {
    // wx.navigateTo({
    //   url: '../fix/fix',
    // })
    console.log(a)
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
        if (res.data) {
          // app.globalData.notadd = false
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
        } else {
          // app.globalData.notadd = true
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
    wx.getStorage({
      key: 'list_con',
      success: function(res) {
        that.setData({
          list_con: res.data
        })
      },
    })
    wx.getStorage({
      key: 'list_letter',
      success: function (res) {
        that.setData({
          list_letter: res.data
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    var url = app.globalData.urlOfLogin
    // 登录获取openid
    util.Login(url).then(function(data) {
      if (data) {
        app.globalData.openid = data
        // wx.setStorageSync('openid', app.globalData.openid);
      }
      var openid = app.globalData.openid;
      // 使用用户标识访问数据库获取用户信息
      util.getMyData(openid).then(function(res) {
        if (res) {
          res.userPhone ? app.globalData.addPhone = true : app.globalData.addPhone = false
          app.globalData.notadd = false;
          wx.setStorage({
            key: 'userInfo',
            data: res,
          })
          if(!app.globalData.QRCode){
          let userPhotoUrl = res.userImg;
          let page = "pages/peerscards/peerscards";
          let scene = res.id;
          util.makeWxQrCode(userPhotoUrl, scene, page, openid).then(function (res) {
            console.log(res)
            app.globalData.QRCode = ("https://www.eqxuan.cn/" + openid + ".png")
          })
          }
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
            notadd: true,
            list_con: [],
            list_letter: []
          })
        }
        that.getData()
      })
    })
    // 获取屏幕高度 scrollview
    if (this.data.screenHeight == '') {
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            screenHeight: res.windowHeight
          })
        }
      })
    }
  },
  // 获取名片数据
  getData() {
    console.log('getData')
    var that = this;
    that.setData({
      notadd: app.globalData.notadd,
      openid: app.globalData.openid
    })
    var openid = app.globalData.openid;
    // 获取当前保存的同行名片
    util.getMyPeers(openid).then(function (res) {
      console.log(res.data.data)
      let letter = [];
      let con = [];
      var length = res.data.data.length;
      if (length) {
        that.setData({
          list_length: length
        })
        // 如果是大写字母则push进letter
        for (let i = 0; i < length; i++) {
          // 如果prepare为空
          if (!res.data.data[i].prepare) {
            res.data.data[i].prepare = pinyin.getFullChars(res.data.data[i].username).toUpperCase()
          }
          if (res.data.data[i].prepare && validateUpperCase(res.data.data[i].prepare.slice(0, 1))) {
            letter.push(res.data.data[i].prepare.slice(0, 1))
          }
        }
        letter.sort()
        // 如果存在非大写字母
        for (let i = 0; i < length; i++) {
          if (res.data.data[i].prepare == null || !validateUpperCase(res.data.data[i].prepare.slice(0, 1))) {
            letter.push('zz')
          }
        }
        // 去重
        letter = that.dedupe(letter)
        let len = letter.length;
        letter.forEach(function (a, b) {
          con[b] = {
            letter: a,
            data: []
          }
          res.data.data.forEach(function (c, d) {
            if (a == c.prepare.slice(0, 1)) {
              con[b].data.push(c)
            }
          })
        })
        res.data.data.forEach(function (c, d) {
          if (!validateUpperCase(c.prepare.slice(0, 1))) {
            con[len - 1].data.push(c)
          }
        })
        // that.setData({
        //   list_con: that.spliceList(con, 10),
        //   list_letter: letter,
        // })
        // that.setData({
        //   list_con: that.spliceList(con, 80)
        // })
        that.setData({
          list_con: con,
          list_letter: letter,
        })
        wx.setStorage({
          key: 'list_con',
          data: con,
        })
        wx.setStorage({
          key: 'list_letter',
          data: letter,
        })
      } else {
        that.setData({
          list_con: [],
          list_letter: []
        })
        wx.setStorage({
          key: 'list_con',
          data: [],
        })
        wx.setStorage({
          key: 'list_letter',
          data: [],
        })
      }
    });
  },
  // 企业详情
  trans: function() {
    wx.navigateTo({
      url: '/pages/company/company',
    })
  },
  // 查看我的名片
  mycards: function() {
    var openid = app.globalData.openid
    wx.navigateTo({
      url: '/pages/mycards/mycards?openid=' + openid,
    })
  },
  // 添加个人信息按钮
  addcards: function(e) {
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
  bindtrans: function() {
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  // 查看名片详情
  select: function(a) {
    // var otheropenid = a.currentTarget.dataset.key;
    // var saveFlag = a.currentTarget.dataset.saveflag;
    var cardId = a.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=0&saveFlag=2',
    })
  },
  onShow: function() {
    this.onLoad()
    // 查询是否设置红点
    app.queryRedDot()
  },
  // es6数组去重方法
  dedupe: function(array) {
    return Array.from(new Set(array))
  },
  // 获取滚动条当前位置
  scrolltoupper: function(e) {
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
  // 分割同行列表数据，避免数据量大时页面加载时间过长
  spliceList(con, num) {
    let j = 0
    let k = 0
    let m = 0
    let list = []
    for (j; j < con.length; j++) {
      list[j] = { letter: con[j].letter, data: [] }
      for (k; k < con[j].data.length; k++) {
        m++
        if (m <= num) {
          list[j].data.push(con[j].data[k])
        } else {
          return list;
        }
      }
    }
  },
  // 分享
  onShareAppMessage: function(a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    return {
      title: '名片Live',
      path: '/pages/findmore/findmore',
      success: function(res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function(e) {
          console.log(e)
        })
      },
      fail: function(res) {
        console.log(a)
        console.log(res)
      }
    }
  }
})