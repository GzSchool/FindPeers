// pages/teampeers/teampeers.js
var app = getApp()
var util = require('../../utils/util.js');
var mta = require('../../utils/mta_analysis.js');
Page({
  data: {
    openid: "",               //用户标识
    name: "",                 //用户名字
    city: "",                 //用户城市
    industry: "",             //用户行业
    company: "",              //用户公司  
    image: "",                //用户头像
    groupId: "",              //群组ID
    list: [],                 //存群里用户列表
    notadd: "",               //判断用户是否已添加信息
    listOfSave: [],           //当前用户未保存的
    server: "",               //服务器地址
    selectAll: false,         //选择全部
    hasSelect: false,         //单个选择
    formId: '',               //表单ID
    list_length: 0,
    // saveFalseNum: 0,
  },
  //页面初始化（只加载一次）
  onLoad: function(ops) {
    mta.Page.init();
    console.log(ops)
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this
    that.setData({
      server: app.globalData.server,
      openid: ops.openid,
      groupId: ops.groupid,
      notadd: app.globalData.notadd,
      searching: true
    }) 
    var list = [];
    var listOfSave = []
    var openId = that.data.openid;
    var groupId = that.data.groupId;
    //获取群里用户
    util.getGroupCards(openId, groupId,1,600).then(function(res) {
      console.log(res.data)
      var length = res.data.data.result.length;
      // for (var i = 0; i < length; i++) {
      //   res.data.data.result[i].isselect = false
      //   if (res.data.data.result[i].saveFlag == 1) {
      //     listOfSave.push(res.data.data.result[i].id)
      //   }
      // }
      res.data.data.result.forEach(function(a,b){
        a.isselect = false
        if (a.saveFlag == 1) {
          listOfSave.push(a.id)
        }
      })
      that.setData({
        list: res.data.data.result.slice(0, 10),
        // saveFalseNum: res.data.data.saveFalseNum,
        listOfSave: listOfSave,
        list_length: res.data.data.result.length - listOfSave.length,
      });
      that.setData({
        list: res.data.data.result,
        searching: false
      })
    })
    //获取用户个人信息
    util.getMyData(openId).then(function(res) {
      if (res) {
        that.setData({
          name: res.username,
          company: res.userCompany,
          industry: res.userIndustry,
          city: res.userCity,
          image: res.userImg,
        })
      }
    })
  },
  //个人分享
  share: function() {
    var that = this
    var openid = this.data.openid
    var groupid = this.data.groupid
    var server = app.globalData.server;
    wx.showModal({
      title: '分享到本群',
      content: '确定分享到本群',
      success: function(r) {
        // if (r.confirm) {
          
        // }
      }
    })
  },
  //点击个人信息
  mycards: function() {
    var groupId = this.data.groupId;
    wx.navigateTo({
      url: '/pages/mycards/mycards?back=true' + '&groupId=' + groupId,
    })
  },
  //保存用户名片
  save: function (e) {
    if (app.globalData.notadd) {
      app.showToast('请先添加个人信息')
    } else {
      var that = this
      that.setData({
        hasSelect: false,
        formId: e.detail.formId
      })
      var openid = app.globalData.openid;
      var groupid = that.data.groupId
      let list = [];
      var listOfSave = [];
      let activeList = [];
      let formId = that.data.formId;
      let saveName = this.data.name;
      let mes = that.data.list;
      for (let i = 0; i < mes.length; i++) {
        if (mes[i].isselect == true) {
          activeList.push(mes[i].id)
        }
      }
      //保存用户  
      wx.showLoading({
        title: '保存中...',
      })      
      util.saveOrUpdate(openid, groupid, 2, activeList, saveName, formId).then(function (res) {
        console.log(res)      
        
        util.getGroupCards(openid, groupid, 1, 600).then(function (adc) {
          console.log(adc)      
          
          var length = adc.data.data.result.length;
          for (var i = 0; i < length; i++) {
            adc.data.data.result[i].isselect = false
            list.push(adc.data.data.result[i]);
            if (adc.data.data.result[i].saveFlag == 1) {
              listOfSave.push(adc.data.data.result[i].id)
            }
          }
          that.setData({
            list: list,
            listOfSave: listOfSave,
            list_length: adc.data.data.result.length - listOfSave.length,
          });
          console.log('---')
          console.log(that.data.listOfSave)
          console.log(that.data.list_length)
        })
        wx.hideLoading()
        if (res.data.success && res.statusCode == 200) {
          app.showToast('保存成功')
        }
      })
    }
  },
  //点击用户名片
  goPeers: function(e) {
    var cardId = e.currentTarget.dataset.id;
    var groupId = this.data.groupId;
    var saveFlag = e.currentTarget.dataset.saveflag
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=' + groupId + '&back=true&saveFlag=' + saveFlag,
    })
  },
  //搜索群里用户名片
  inputSearch: function() {
    var groupid = this.data.groupId
    wx.navigateTo({
      url: '/pages/searchInGroup/searchInGroup?groupid=' + groupid,
    })
  },
  //当前用户添加信息
  addcards: function(e) {
    var openid = app.globalData.openid;
    var groupId = this.data.groupId
    if (e.detail.userInfo) {
      wx.redirectTo({
        url: '/pages/addcards/addcards?back=true&groupId=' + groupId + '&openid=' + openid,
      })
    }
  },
  //全选
  selectAll: function() {
    let val = this.data.selectAll
    let list = this.data.list
    for (let i = 0; i < list.length; i++) {
      list[i].isselect = val ? false : true
    }
    this.setData({
      selectAll: val ? false : true,
      hasSelect: val ? false : true,
      list: list
    })
  },
  //单选
  selectOne: function(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.list
    list[i].isselect = list[i].isselect ? false : true
    this.setData({
      list: list
    })
    let j = 0;
    for (let k = 0; k < list.length; k++) {
      if (list[k].isselect === true) {
        j++;
      }
    }
    if (j === list.length) { //全选
      this.setData({
        selectAll: true,
        hasSelect: true
      })
    } else if (j === 0) { //没有被选中的项
      this.setData({
        hasSelect: false,
        selectAll: false
      })
    } else {
      this.setData({ // 有被选中的项
        selectAll: false,
        hasSelect: true
      })
    }
  },
  //转发分享
  onShareAppMessage: function (a) {               //转发
    let that = this
    let otheropenId = that.data.otheropenId;
    return {
      title: '名片Live',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow:function(e){
    var ops = { openid: this.data.openid, groupid: this.data.groupId };
    this.onLoad(ops);
    let that = this
    that.setData({
      selectAll:false
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          name: res.data.username,
          company: res.data.userCompany,
          industry: res.data.userIndustry,
          city: res.data.userCity,
          image: res.data.userImg,
        })
      },
    })
    let openId = app.globalData.openid;
    util.getMyData(openId).then(function (res) {
      if (res) {
        that.setData({
          name: res.username,
          company: res.userCompany,
          industry: res.userIndustry,
          city: res.userCity,
          image: res.userImg,
        })
      }
    })
  }
})