// pages/inputSearch/inputSearch.js
var app=getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    list: [],
    cardId:"",
    key: " 微信号、城市、公司、行业等进行搜索",
    // hidden: true,
    // server:"",
    scrollTop: 0,
    scrollHeight: 0,
  },
  onLoad: function (options) {
  // var that=this
  // that.data.server=app.globalData.server
  },
  bindSearch:function(res){
    let key = res.detail.value;
    console.log(key)
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var list=that.data.list
    // var server = that.data.server;
    list=[];
    if (key.length !== 0) {
      util.searchByParam(key).then(function (src) {
        console.log(src)
        var length = src.data.data.length;
        for (var i = 0; i < length; i++) {
          list.push(src.data.data[i]);
        }
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        })
      })
    }
  },
  find:function(a){
    console.log(a)
    var openId=a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    console.log(openId)
    wx.navigateTo({
      url: '/pages/peerscards/peerscards?cardId=' + cardId +'&isshow=true',
    })
  },
  onShow(){
    this.onLoad();
  }
})