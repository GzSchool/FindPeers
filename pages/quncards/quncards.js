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
    var openGid=app.globalData.openGid;
    var list=that.data.list;
    wx.request({
      method: 'GET',
      url: server+'/userGroup/findUserGroupByParam',
      data: {
        openId: openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(b){
        console.log(b)
        var length=b.data.data.length;
        var i = 0
        for (i; i < length; i++) {
          console.log(length);
          console.log(i);

          list.push(b.data.data[i]);
        }
        console.log(list)
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        });
      }
    })
  },
  search:function(a){
   console.log(a)
   var openid = a.currentTarget.dataset.id;
   var groupid=a.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/teampeers/teampeers?openid='+openid+'&groupid='+groupid,
    })
  },
  onShow:function(){
    this.onLoad();
  }
})