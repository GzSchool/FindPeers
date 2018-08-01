   // pages/quncards/quncards.js
var util = require('../../utils/util.js');
var app=getApp() 
Page({
  data: {
  qunname:"格致文化",
  nonum:0,
  num:1,
  server:"",
  time:"2018/7/16",
  list: [],
  hidden: true,
  scrollTop: 0,
  scrollHeight: 0
  },
  onLoad:function(a){
    var that = this;
    that.data.server=app.globalData.server
    var server = that.data.server
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.setData({
      list:[]
    })
    var openid=app.globalData.openid;
    var groupid = app.globalData.groupid;
    var list=that.data.list;
    util.getUserGroupById(openid).then(function(res){
      console.log(res)
      var length = res.data.data.length;
      for (var i = 0; i < length; i++) {
        // 处理时间截取字母T之前的年月日
        res.data.data[i].ctTime = res.data.data[i].ctTime.split('T')[0];
        list.push(res.data.data[i]);
      }
      that.setData({
        list: list
      });
      that.setData({
        hidden: true
      });
    })
  },
  search:function(a){
   console.log(a)
   var openid = a.currentTarget.dataset.id;
   var groupid=a.currentTarget.dataset.key;
   console.log(groupid)
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid='+openid+'&groupid='+groupid,
    })
  },
  onShow:function(){
    this.onLoad();
  }
})