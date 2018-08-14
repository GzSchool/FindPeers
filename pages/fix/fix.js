// pages/mycards/mycards.js
import pinyin from '../../utils/pinyin.js'
import {
  validateEmail_none,
  isvalidatemobile_none,
  validateUpperCase // 大写字母
} from '../../utils/validate.js'
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    mineInfo: { //缓存  
      name: '', //用户名字
      idustry: '', //用户行业
      city: '', //用户城市
      company: '', //用户公司
      phone: '', //用户手机号
      wechatnum: '', //用户微信号
      email: '', //用户邮箱
      userJob: ''
    },
    cardType: '',
    openid: "", //用户标识
    count: 0, //简介长度
    groupId: "", //群组ID
    name: "", //用户名字
    wechatnum: "", //用户微信号
    company: "", //用户公司
    idustry: "", //用户行业
    job: '', //用户职务
    back: "", //判断是否是从群里点击的
    server: "", //服务器地址
    id: '', //用户名片ID
    city: "", //用户城市
    phone: "", //用户手机号
    demand: "", //需求
    introduction: "", //简介
    resource: "", //资源
    email: "", //邮箱
    homepage: "", //个人主页
    companyWeb: "", //公司官网
    isshow0: false, //是否显示需求
    isshow1: false, //是否显示资源
    isshow2: false, //是否显示个人主页
    isshow3: false, //是否显示公司官网
    image: "", //用户头像
    prepare: '', //用户名字拼音
    region: '',
    customItem: '',
  },
  //页面加载
  onLoad: function(a) {
    var that = this
    wx.showShareMenu({
      withShareTicket: true
    })
    that.data.openid = app.globalData.openid;
    // 缓存
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          mineInfo: {
            name: res.data.username,
            idustry: res.data.userIndustry,
            city: res.data.userCity,
            company: res.data.userCompany,
            phone: res.data.userPhone,
            wechatnum: res.data.userWechat,
            email: res.data.userEmail,
            userJob: res.data.userJob
          },
          name: res.data.username,
          wechatnum: res.data.userWechat,
          company: res.data.userCompany,
          idustry: res.data.userIndustry,
          city: res.data.userCity,
          email: res.data.userEmail,
          phone: res.data.userPhone,
          image: res.data.userImg,
          demand: res.data.demand,
          resource: res.data.resources,
          homepage:res.data.homePage,
          companyWeb:res.data.companyPage,
          introduction: res.data.synopsis,
          id: res.data.id,
          job: res.data.userJob,
          count: res.data.synopsis.length, // 简介长度
          cardType: res.data.cardType
        })
        if (that.data.demand !== '') {
          that.setData({
            isshow0: true
          })
        }
        if (that.data.resource !== '') {
          that.setData({
            isshow1: true
          })
        }
        if (that.data.homepage !== '') {
          that.setData({
            isshow2: true
          })
        }
        if (that.data.companyWeb !== '') {
          that.setData({
            isshow3: true
          })
        }
      },
      fail: function(res) {
        that.getMyData()
      }
    })
    //是否从群里点击的
    if (a.back) {
      that.setData({
        back: true,
        groupId: a.groupId
      })
    }
  },
  // 获取个人信息，缓存获取失败时调用
  getMyData() {
    let that = this
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    var server = app.globalData.server
    wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        console.log(b.data.data)
        that.setData({
          mineInfo: {
            name: b.data.data.username,
            idustry: b.data.data.userIndustry,
            city: b.data.data.userCity,
            company: b.data.data.userCompany,
            phone: b.data.data.userPhone,
            wechatnum: b.data.data.userWechat,
            email: b.data.data.userEmail,
            userJob: b.data.data.userJob
          },
          name: b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          email: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
          demand: b.data.data.demand,
          resource: b.data.data.resources,
          introduction: b.data.data.synopsis,
          homepage: b.data.data.homePage,
          companyWeb: b.data.data.companyPage,
          id: b.data.data.id,
          job: b.data.data.userJob,
          count: b.data.data.synopsis.length, // 简介长度
          cardType: b.data.data.cardType
        })
        if (that.data.demand !== '') {
          that.setData({
            isshow0: true
          })
        }
        if (that.data.resource !== '') {
          that.setData({
            isshow1: true
          })
        }
        if (that.data.homepage !== '') {
          that.setData({
            isshow2: true
          })
        }
        if (that.data.companyWeb !== '') {
          that.setData({
            isshow3: true
          })
        }
      }
    })
  },
  //点击添加更多
  addmore: function() {
    var that = this
    wx.showActionSheet({
      itemList: ["个人主页", "公司官网", "需求", "资源"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            isshow2: true
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            isshow3: true
          })
        } else if (res.tapIndex == 2) {
          that.setData({
            isshow0: true
          })
        } else {
          that.setData({
            isshow1: true
          })
        }
      }
    })
  },
  //填写名字
  addname: function(e) {
    let prepare = pinyin.getFullChars(e.detail.value).toUpperCase()
    let begin_letter = pinyin.getFullChars(e.detail.value).toUpperCase().slice(0, 1)
    if (!validateUpperCase(begin_letter)) {
      prepare = '#' + prepare
    }
    this.data.prepare = prepare
    this.data.name = e.detail.value
  },
  //填写微信号
  addnumber: function(e) {
    this.setData({
      wechatnum: e.detail.value
    })
  },
  //填写公司
  addcompany: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  //填写城市
  addcity: function(e) {
    this.setData({
      city: e.detail.value
    })
  },
  //填写职务
  addjob: function(e) {
    this.data.job = e.detail.value
  },
  //填写手机号
  addphone: function(e) {
    this.data.phone = e.detail.value
  },
  //填写需求
  adddemand: function(e) {
    this.data.demand = e.detail.value
  },
  //填写资源
  addresource: function(e) {
    this.data.resource = e.detail.value
  },
  //填写邮箱
  addemail: function(e) {
    this.data.email = e.detail.value
  },
  //添加个人主页
  addHomepage: function(e) {
    this.data.homepage = e.detail.value

  },
  //添加公司官网
  addCompanyWeb: function(e) {
    this.data.companyWeb = e.detail.value
  },
  //填写简介
  introInput: function(e) {
    let i = e.detail.value.length
    this.data.introduction = e.detail.value
    this.setData({
      count: i
    })
  },
  //点击保存按钮
  save: function() {
    let that = this
    let prepare = pinyin.getFullChars(that.data.name).toUpperCase()
    let begin_letter = pinyin.getFullChars(that.data.name).toUpperCase().slice(0, 1)
    if (!validateUpperCase(begin_letter)) {
      prepare = '#' + prepare
    }
    this.data.prepare = prepare
    //名字是空的时候获取微信名字
    if (this.data.name == '' || this.data.name == null) {
      wx.getUserInfo({
        success: function(a) {
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl,
            prepare: pinyin.getFullChars(a.userInfo.nickName).toUpperCase()
          })
          console.log(a.userInfo.gender)
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
  //点击获取手机号
  getPhoneNumber: function(e) {
    wx.login({ //微信获取手机号需要code解密      
      success: function(res) {
        if (res.code) {
          // wx.request({
          //   method: 'POST',
          //   data: {
          //     code: e.detail.code,
          //     iv: e.detail.iv,
          //     encryptedData: e.detail.encryptedData
          //   },
          //   url: server + '/userCard/saveOrUpdate',
          //   header: {
          //     'content-type': 'application/json'
          //   },
          // })
        }
      }
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {} else {}
  },
  //设置行业
  chooseIn() {
    wx.navigateTo({
      url: '../industry/industry',
    })
  },
  //保存时调用
  getData: function() {
    let server = app.globalData.server
    let that = this
    if (!isvalidatemobile_none(this.data.phone)) {
      app.showToast('手机号格式不正确')
    } else if (!validateEmail_none(this.data.email)) {
      app.showToast('邮箱格式不正确')
    } else if (this.data.job == '') {
      app.showToast('职务不能为空')
    } else if (this.data.wechatnum == '') {
      app.showToast('微信号不能为空')
    } else if (this.data.company == '') {
      app.showToast('公司名称不能为空')
    } else if (this.data.idustry == '') {
      app.showToast('行业信息不能为空')
    } else if (this.data.city == '') {
      app.showToast('城市信息不能为空')
    } else if (this.data.name == '') {
      wx.getUserInfo({
        success: function(a) {
          this.data.name = a.userInfo.nickName;
        }
      })
    } else if (this.data.image == '' || this.data.image == null) {
      wx.getUserInfo({
        success: function(a) {
          this.data.image = a.userInfo.avatarUrl;
        }
      })
    } else {
      console.log(this.data.prepare)
      wx.request({
        method: 'POST',
        data: {
          id: this.data.id,
          username: this.data.name,
          openId: this.data.openid,
          userWechat: this.data.wechatnum,
          userCity: this.data.city,
          userCompany: this.data.company,
          userIndustry: this.data.idustry,
          userPhone: this.data.phone,
          userJob: this.data.job,
          demand: this.data.demand,
          resources: this.data.resource,
          homePage:this.data.homepage,
          companyPage:this.data.companyWeb,
          synopsis: this.data.introduction,
          userEmail: this.data.email,
          userImg: this.data.image,
          prepare: this.data.prepare,
          cardType: this.data.cardType
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          app.showToast("修改成功");
          app.getUserData(app.globalData.openid)
          //是否是从群里点击的
          var back = that.data.back;
          if (back) {
            let openid = app.globalData.openid;
            let groupId = that.data.groupId;
            wx.navigateBack({
              delta: 2
            })
            // wx.navigateTo({
            //   url: '/pages/teampeers/teampeers?groupid=' + groupId + '&openid=' + openid,
            // })
          } else {
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }
        }
      })
    }
  },
  //选择城市
  cityChange(e) {
    let dedupeCity = this.dedupe(e.detail.value)
    this.setData({
      city: dedupeCity.join('')
    })
  },
  //es6去重
  dedupe: function(array) {
    return Array.from(new Set(array))
  },
  // 分享信息
  onShareAppMessage: function(a) {
    var that = this
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function(res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function(e) {
          console.log(e)
        })
      },
      fail: function(res) {
        console.log(res)
        // 转发失败
      }
    }
  },
  chooseCard: function(e) {
    let id = e.currentTarget.dataset.idx
    this.setData({
      cardType: id
    })
  }
})