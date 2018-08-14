// pages/searchInGroup/searchInGroup.js
// pages/inputSearch/inputSearch.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    notadd: app.globalData.notadd, //判断是否已添加信息
    loading: false, // 显示加载中
    loadAll: false, // 是否已加载全部
    noresult: false, // 是否显示无搜索结果
    searching: false, // 搜索中
    list: [],
    mes: '', // 输入框内容
    key: " 微信号、城市、公司、行业等进行搜索",
    groupid: '',
    // pageNum: 1, //当前页数
    // pageSize: 10, //显示数量
  },
  //页面转发
  onShareAppMessage: function (a) {
    let server = app.globalData.server;
    let that = this
    let otheropenId = that.data.otheropenId;
    return {
      title: '名片Live',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function(e){
          console.log(e)
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //页面加载
  onLoad: function(options) {
    let val = this.options.groupid
    this.setData({
      notadd: app.globalData.notadd,
      groupid: val,
    })
  },
  //刷新页面（每次进页面都会刷新）
  onShow: function() {
    this.onLoad()
  },
  //搜索同行
  bindSearch: function(res) {
    let key = res.detail.value;
    var openid = app.globalData.openid
    let groupid = this.data.groupid
    this.setData({
      mes: key,
      loadAll: false,
      noresult: false,
      searching: false,
      // pageNum: 1,
    })
    let that = this;
    let list = []
    // let pageSize = this.data.pageSize
    if (key) {
      this.setData({
        searching: true
      })
      util.searchInGroup(key, openid, groupid).then(function(res) {
        if (res.data.success) {
          let len = res.data.data.length;
          if (len == 0) {
            that.setData({
              noresult: true,
              list: []
            });
          } else {
            // list.push(...res.data.data)
            list = res.data.data
            that.setData({
              list: res.data.data.slice(0, 10)
            })
          }
          that.setData({
            list: list,
            searching: false
          });
        }
      })
    } else {
      that.setData({
        list: [],
        searching: false
      });
    }
  },
  //点击同行信息
  find: function(a) {
    var openId = a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    var saveFlag = a.currentTarget.dataset.saveflag;
    console.log(this.data.groupid)
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&saveFlag=' + saveFlag + '&groupId=' + this.data.groupid + '&back=true'
    })
  }
})