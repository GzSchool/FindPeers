// pages/inputSearch/inputSearch.js
var app=getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    notadd: true,
    list: [],
    cardId:"",
    mes: '',        // 输入框内容
    pageNum: 1,
    pageSize: 20,
    loading: false, // 显示加载中
    loadAll: false, // 是否已加载全部
    noresult: false, // 是否显示无搜索结果
    key: " 微信号、城市、公司、行业等进行搜索",
  },
  onLoad: function (options) {
    this.setData({
      notadd: app.globalData.notadd
    })
  },
  onShow: function () {
    this.onLoad()
  },
  bindSearch:function(res){
    let key = res.detail.value;
    this.setData({
      mes: key,
      pageNum: 1,
      loadAll: false
    })
    let that = this;
    let list = []
    let pageSize = this.data.pageSize
    if (key.length !== 0) {
      util.searchByParam(key, 1, pageSize).then(function (res) {
        console.log(res.data)
        if (res.data.success) {
          let len = res.data.data.result.length;
          if (len == 0) {
            that.setData({
              noresult: true
            });
          } else {
            list.push(...res.data.data.result)
          }
          that.setData({
            list: list
          });
        }
      })
    }
  },
  find:function(a){
    console.log(a)
    var openId=a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    var saveFlag = a.currentTarget.dataset.saveflag;
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&isshow=true' + '&saveFlag=' + saveFlag + '&groupId=0'
    })
  },
  onReachBottom () {
    if (!this.data.loadAll) {
      this.data.pageNum = this.data.pageNum + 1;
      let that = this
      that.setData({
        loading: true
      })
      let list = this.data.list
      util.searchByParam(this.data.mes, this.data.pageNum, this.data.pageSize).then(function (res) {
        that.setData({
          loading: false
        })
        let len = res.data.data.result.length
        if (len == 0) {
          that.setData({
            loadAll: true
          })
        } else {
          list.push(...res.data.data.result)
          that.setData({
            list: list
          })
        }
      })
    }
  }
})