// pages/inputSearch/inputSearch.js
var app=getApp()
var util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js');
Page({
  data: {
    notadd: true,     //判断是否已添加信息
    list: [],         //显示列表
    mes: '',          // 输入框内容
    pageNum: 1,       //当前页面
    pageSize: 10,     //当前页显示数
    loading: false,   // 显示加载中
    loadAll: false,   // 是否已加载全部
    noresult: false,  // 是否显示无搜索结果
    searching: false, 
  },
  //页面加载
  onLoad: function (options) {
    mta.Page.init();
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      notadd: app.globalData.notadd
    })
  },
  //刷新页面
  onShow: function () {
    this.onLoad()
  },
  //搜索
  bindSearch:function(res){
    let key = res.detail.value;         //用户输入的内容
    var openid = app.globalData.openid
    this.setData({
      mes: key,
      pageNum: 1,
      loadAll: false,
      searching: false,
      noresult: false
    })
    let that = this;
    let list = []
    let pageSize = this.data.pageSize
    if (key) {
      this.setData({
        searching: true
      })
      util.searchByParam(key, openid).then(function (res) {
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
  //点击搜索到的同行
  find:function(a){
    var openId=a.currentTarget.dataset.key;             //同行的openid
    var cardId = a.currentTarget.dataset.id;            //同行名片ID
    var saveFlag = a.currentTarget.dataset.saveflag;    //当前用户是否保存同行
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&saveFlag=' + saveFlag + '&groupId=0'
    })
  },
  //转发分享
  onShareAppMessage: function (a) {
    var that = this
    return {
      title: '名片Live',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  }
})