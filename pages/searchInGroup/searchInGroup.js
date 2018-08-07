// pages/searchInGroup/searchInGroup.js
// pages/inputSearch/inputSearch.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    notadd: true, //判断是否已添加信息
    loading: false, // 显示加载中
    loadAll: false, // 是否已加载全部
    noresult: false, // 是否显示无搜索结果
    searching: false,
    list: [],
    mes: '', // 输入框内容
    pageNum: 1, //当前页数
    pageSize: 10, //显示数量
    key: " 微信号、城市、公司、行业等进行搜索",
    groupid: '',
  },
  //页面转发
  onShareAppMessage: function(a) {
    var that = this
    var openId = app.globalData.openid;
    var otherOpenId = app.globalData.openid;
    console.log(openId)
    console.log(otherOpenId)
    util.sharePage(openId, otherOpenId).then(function(e) {
      console.log(e);
    });
  },
  //页面加载
  onLoad: function(options) {
    let val = this.options.groupid
    this.setData({
      notadd: app.globalData.notadd,
      groupid: val
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
      pageNum: 1,
      loadAll: false,
      noresult: false,
      searching: false
    })
    let that = this;
    let list = []
    let pageSize = this.data.pageSize
    if (key) {
      this.setData({
        searching: true
      })
      util.searchInGroup(key, openid, groupid).then(function(res) {
        if (res.data.success) {
          let len = res.data.data.length;
          if (len == 0) {
            that.setData({
              noresult: true
            });
          } else {
            list.push(...res.data.data)
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
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&isshow=true&saveFlag=' + saveFlag + '&groupId=0'
    })
  }
})