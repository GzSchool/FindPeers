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
      url: 'https://192.168.2.123:8080/userCard/findAllByParam',
      data: {
        param:key
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(list);
        var length=res.data.data.length;
        for (var i = 0; i < length; i++) {
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
  },
  find:function(a){
    console.log(a)
    var openId=a.currentTarget.dataset.key;
    console.log(openId)
    wx.navigateTo({
      url: '/pages/peerscards/peerscards?otheropenid=' + openId +'&isshow=true',
    })
  }
  
})