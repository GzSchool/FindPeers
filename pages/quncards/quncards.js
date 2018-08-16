   // pages/quncards/quncards.js
   var util = require('../../utils/util.js');
   var app = getApp()
   Page({
     data: {
       list: [],
       searching: false
     },
     //页面加载
     onLoad: function(a) {
       wx.showShareMenu({
         withShareTicket: true
       })
       var that = this;
       var openid = app.globalData.openid;
       var list = that.data.list;
       that.setData({
         searching: true
       })
       util.getUserGroupById(openid).then(function(res) {
         console.log(res.data.data)
         var len = res.data.data.length;
         let j = 0;
         for (var i = 0; i < len; i++) {
           // 处理时间截取字母T之前的年月日
           if (res.data.data.upTime) {
             res.data.data[i].upTime = res.data.data[i].upTime.split('T')[0];
           } else {
             res.data.data[i].upTime = res.data.data[i].ctTime.split('T')[0];
           }
           if (res.data.data[i].hint == 1) {
             wx.showTabBarRedDot({
               index: 1,
             })
           }
           if (res.data.data[i].hint == 0) {
             j++;
             if (j == len) {
               wx.hideTabBarRedDot({
                 index: 1,
               })
             }
           }
         }
         that.setData({
           list: res.data.data,
           searching: false
         });
       })
     },
     //点击群
     search: function(a) {
       var openid = a.currentTarget.dataset.id;
       var groupid = a.currentTarget.dataset.key;
       wx.hideTabBarRedDot({
         index: 1,
       })
       wx.navigateTo({
         url: '/pages/teampeers/teampeers?openid=' + openid + '&groupid=' + groupid,
       })
     },
     //页面刷新
     onShow: function() {
       this.onLoad();
     },
     //转发
     onShareAppMessage: function(a) {
       var that = this
       return {
         title: '名片Live',
         path: '/pages/findmore/findmore',
         success: function(res) {
           let openId = app.globalData.openid;
           let otherOpenId = app.globalData.openid;
           util.sharePage(openId, otherOpenId, res).then(function(e) {
             console.log(e)
           })
         },
         fail: function(res) {
           // 转发失败
         }
       }
     }
   })