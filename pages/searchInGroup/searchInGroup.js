// pages/searchInGroup/searchInGroup.js
// pages/inputSearch/inputSearch.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    notadd: true,
    list: [],
    cardId: "",
    mes: '',        // 输入框内容
    pageNum: 1,
    pageSize: 10,
    loading: false, // 显示加载中
    loadAll: false, // 是否已加载全部
    noresult: false, // 是否显示无搜索结果
    key: " 微信号、城市、公司、行业等进行搜索",
    groupid: ''
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
                otherOpenId: app.globalData.openId,
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
  onLoad: function (options) {
    let val = this.options.groupid
    this.setData({
      notadd: app.globalData.notadd,
      groupid: val
    })
    // console.log('---')
    console.log(this.options.groupid)
  },
  onShow: function () {
    this.onLoad()
  },
  bindSearch: function (res) {
    let key = res.detail.value;
    var openid = app.globalData.openid
    let groupid = this.data.groupid
    this.setData({
      mes: key,
      pageNum: 1,
      loadAll: false
    })
    let that = this;
    let list = []
    let pageSize = this.data.pageSize
    console.log(key.length)
    if (key.length !== 0) {
      console.log(openid)
      util.searchInGroup(key, openid, groupid).then(function (res) {
        console.log(res.data)
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
            list: list
          });
        }
      })
    } else {
      that.setData({
        list: []
      });
    }
  },
  find: function (a) {
    console.log(a)
    var openId = a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    var saveFlag = a.currentTarget.dataset.saveflag;
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&isshow=true' + '&saveFlag=' + saveFlag + '&groupId=0'
    })
  }
})