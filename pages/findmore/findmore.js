// pages/findmore/findmore.js
Page({
  data:{
    name:'张三',
    job:'java',
    company:'格致文化',
    openid:123
  },
  trans:function(){
    wx.navigateTo({
      url: '/pages/company/company?openid',
    })
  },
  mycards:function(){
    wx.navigateTo({
      url: '/pages/mycards/mycards',
    })
  },
  peerscards:function(){
    wx.navigateTo({
      url: '/pages/peerscards/peerscards',
    })
  }
})