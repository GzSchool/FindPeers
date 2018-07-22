// pages/inputSearch/inputSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"微信号，行业，城市等进行搜索",
    list: [],
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
  
  },
  bindSearch:function(res){
    var key=res.detail.value;
    console.log(key)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var list=that.data.list
    wx.request({
      method: 'GET',
      url: 'http://localhost:8080/userCard/findAllByParam',
      data: {
        param:key
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(list);
        for (var i = 0; i < 3; i++) {
          list.push(res.data.data[i]);
        }
        that.setData({
          list: list
        });
        that.setData({
          hidden: true
        });
      }
    });
  }
  
})