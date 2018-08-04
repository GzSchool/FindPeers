// pages/findmore/findmore.js
var app = getApp();
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
    list_id: ''
  },
  onLoad: function (a) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight
        })
      },
    })
    console.log(a)
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
      console.log(that.data.list)
      let val = JSON.stringify(res.data.data) == JSON.stringify(that.data.list)
      console.log(val)
      if (!val) {
        let letter = [];
        let con = [];
        var length = res.data.data.length;
        for (let i = 0; i < length; i ++) {
          // console.log(res.data.data[i].prepare.slice(0, 1))
          letter.push(res.data.data[i].prepare.slice(0, 1))
          
        }
        console.log(letter)
        that.setData({
          list: res.data.data,
          list_letter: letter
        })
      }
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
  },
  letterClick(e) {
    this.setData({
      list_id: e.target.dataset.item
    });
    console.log(this.data.list_id)
  }
})