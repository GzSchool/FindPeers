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
  onShareAppMessage: function (a) {
    var server = app.globalData.server;
    var that = this
    var otheropenId = that.data.otheropenId;
    return {
      title: '找同行',
      path: '/pages/findmore/findmore',
      success: function (res) {
        console.log("66666666666")
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',

              data: {
                openId: app.globalData.openId,
                otherOpenId: app.globalData.openId,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                
              }
            })
          }
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