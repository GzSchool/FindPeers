// pages/company/company.js
var app=getApp()
Page({
  data: {
    server:""
  }
  , touch:function(){
    var that=this
    that.data.server=app.globalData.server;
   
  }
 
})