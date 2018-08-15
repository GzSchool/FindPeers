// pages/addCards/addcards.js
import pinyin from '../../utils/pinyin.js'
import {
  validateEmail_none,
  isvalidatemobile_none,
  validateUpperCase // 大写字母
} from '../../utils/validate.js'
var app = getApp();
Page({
  data: {
    cardType: 1,
    count: 0, //简介字数
    openid: "", //用户标识
    othercardid: "", //分享的人的标识
    groupId: "", //群id
    name: "", //用户名字
    wechatnum: "", //用户填写的微信号
    image: "", //用户的微信头像
    company: "", //用户填写的公司名称
    idustry: "", //用户选择的行业
    job: '', //用户填写的职务 
    city: "", //用户填写的城市
    phone: "", //用户手机号
    server: "", //服务器地址
    demand: "", //用户填写的需求
    introduction: "", //用户简介
    resource: "", //用户资源
    email: "", //用户邮箱
    homepage:"",//个人主页
    companyWeb:"",//公司官网
    back: "", //是否返回
    isshow0: false, //个人主页是否显示
    isshow1: false, //公司官网是否显示
    isshow2: false,  //需求是否显示
    isshow3: false, //资源是否显示
    formId: '',
    list: ["个人主页", "公司官网", "需求", "资源"], // 添加更多项
    saveLoading: false,
    region: '',
    customItem: '',
    addPhone: "",
    QRCode:"",    //小程序二维码
  },
  onLoad: function(res) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this
    that.data.server = app.globalData.server;
    that.data.openid = app.globalData.openid;
    that.data.othercardid = app.globalData.othercardid;
    var openid = that.data.openid;
    if (res.back) {
      that.setData({
        back: true,
        openid: res.openid,
        groupId: res.groupId,
      })
    } else {
      that.setData({
        back: false,
        openid: res.openid,
        groupId: res.groupId,
      })
    }
    console.log(openid)
    console.log(that.data.groupId)
    wx.getUserInfo({
      success: function(a) {
        that.setData({
          image: a.userInfo.avatarUrl
        })
      }
    })
  },
  addname: function(e) {
    let prepare = pinyin.getFullChars(e.detail.value).toUpperCase()
    let begin_letter = pinyin.getFullChars(e.detail.value).toUpperCase().slice(0, 1)
    if (!validateUpperCase(begin_letter)) {
      prepare = '#' + prepare
    }
    console.log(prepare)
    this.data.prepare = prepare
    this.setData({
      name: e.detail.value
    })
  },
  addnumber: function(e) {
    this.setData({
      wechatnum: e.detail.value
    })
  },
  addcompany: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  addcity: function(e) {
    this.setData({
      city: e.detail.value
    })
  },
  addjob: function(e) {
    this.setData({
      job: e.detail.value
    })
  },
  addphone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  adddemand: function(e) {
    this.data.demand = e.detail.value
  },
  addresource: function(e) {
    this.data.resource = e.detail.value
  },
  addemail: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  addHomepage:function(e){
    this.setData({
      homepage: e.detail.value
    })
  },
  addCompanyWeb: function (e) {
    this.setData({
      companyWeb: e.detail.value
    })
  },
  introInput(e) {
    this.data.introduction = e.detail.value
    let i = e.detail.value.length
    this.setData({
      count: i
    })
  },
  // 用户点击保存
  save: function(e) {
    this.setData({
      formId: e.detail.formId
    })
    console.log(this.data.formId)
    let that = this
    if (this.data.name == '' || this.data.name == null) {
      wx.getUserInfo({
        success: function(a) {
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl,
            prepare: pinyin.getFullChars(a.userInfo.nickName).toUpperCase()
          })
          console.log(that.data.prepare)
          that.getData()
        },
        fail: function() {
          app.showToast("姓名不能为空")
        }
      })
    } else {
      that.getData()
    }
  },
  // 用户点击微信获取手机
  getPhoneNumber: function(e) { 
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    } else {
      console.log(e)
      var that = this
      var openId = app.globalData.openid
      var iv = e.detail.iv
      var encryptedData = e.detail.encryptedData
      util.getUserPhone(openId, iv, encryptedData).then(function (res) {
        console.log(res)
        that.setData({
          phone: res.data.data
        })
      })
    }
  },
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  },
  getData() {
    var that = this
    var othercardid = app.globalData.othercardid
    var server = this.data.server
    var back = false;
    if (this.data.back == "") {
      back = false
    } else {
      back = this.data.back
    }
    if (!isvalidatemobile_none(this.data.phone)) {
      app.showToast('手机号格式不正确')
    } else if (!validateEmail_none(this.data.email)) {
      app.showToast('邮箱格式不正确')
    } else if (this.data.job == '') {
      app.showToast('职务不能为空')
    } else if (this.data.wechatnum == "") {
      app.showToast('微信号不能为空')
    } else if (this.data.company == "") {
      app.showToast('公司名称不能为空')
    } else if (this.data.idustry == "") {
      app.showToast('行业信息不能为空')
    } else if (this.data.city == "") {
      app.showToast('城市信息不能为空')
    } else if (this.data.name == '') {
      wx.getUserInfo({
        success: function(a) {
          console.log(a)
          this.data.name = a.userInfo.nickName;
        }
      })
    } else if (this.data.image == '') {
      wx.getUserInfo({
        success: function(a) {
          console.log(a)
          this.data.image = a.userInfo.avatarUrl;
        }
      })
    } else {
      console.log(this.data.prepare)
      that.data.saveLoading = true
      wx.request({
        method: 'POST',
        data: {
          username: this.data.name,
          openId: app.globalData.openid,
          userWechat: this.data.wechatnum,
          userCity: this.data.city,
          userImg: this.data.image,
          userCompany: this.data.company,
          userIndustry: this.data.idustry,
          userPhone: this.data.phone,
          userJob: this.data.job,
          demand: this.data.demand,
          resources: this.data.resource,
          synopsis: this.data.introduction,
          userEmail: this.data.email,
          homePage:this.data.homepage,
          companyPage:this.data.companyWeb,
          prepare: this.data.prepare,
          formId: this.data.formId,
          cardType: this.data.cardType
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.data.saveLoading = true
          app.globalData.notadd = false
          console.log(res)
          if (that.data.phone) {
            app.globalData.addPhone = true
          } else {
            app.globalData.addPhone = false
          }
          var openid = app.globalData.openid;
          console.log(openid)
          var othercardid = app.globalData.othercardid;
          var openid = that.data.openid;
          var groupId = that.data.groupId;
          app.showToast("保存成功");
          if (othercardid != "") {
            app.globalData.notadd = false
            wx.redirectTo({
              url: '/pages/peerscards/peerscards?othercardid=' + othercardid,
            })
          } else if (back) {
            app.globalData.notadd = false;
            wx.redirectTo({
              url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupId,
            })
          } else {
            app.globalData.notadd = false
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
        }
      })
    }
  },
  //城市选择
  cityChange(e) {
    let dedupeCity = this.dedupe(e.detail.value)
    this.setData({
      city: dedupeCity.join('')
    })
  },
  //es6去重
  dedupe: function (array) {
    return Array.from(new Set(array))
  },
  //转发
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
        // 转发失败
      }
    }
  },
  // 选择名片类型
  chooseCard: function (e) {
    let id = e.currentTarget.dataset.idx
    this.setData({
      cardType: id
    })
  },
  //点击添加更多
  bindPickerChange(e) {
    let id = e.detail.value
    if (this.data.list[id] == '个人主页') {
      this.setData({
        isshow0: true
      })
    }
    if (this.data.list[id] == '公司官网') {
      this.setData({
        isshow1: true
      })
    }
    if (this.data.list[id] == '需求') {
      this.setData({
        isshow2: true
      })
    }
    if (this.data.list[id] == '资源') {
      this.setData({
        isshow3: true
      })
    }
    let list = []
    for (var i = 0; i < this.data.list.length; i++) {
      if (this.data.list[id] !== this.data.list[i]) {
        list.push(this.data.list[i])
      }
    }
    this.setData({
      list: list
    })
  }
})
