// pages/quncards/quncards.js
var app=getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
  qunname:"格致文化",
  nonum:0,
  num:1,
  time:"2018/7/16",
  list: [],
  hidden: true,
  list: [],
  scrollTop: 0,
  scrollHeight: 0
  },
  onLoad:function(a){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var openid=app.globalData.openid;
    var openGid=app.globalData.openGid;
    var list=that.data.list;
    wx.request({
      method: 'GET',
      url: 'http://localhost:8080/userGroup/findGroupCards',
      data: {
        openId: "333",
        groupId:"1",
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(b){
        console.log(b)
        for (var i = 0; i < 3; i++) {
          list.push(b.data.data[i]);
        }
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        });
      }
    })
  }
})