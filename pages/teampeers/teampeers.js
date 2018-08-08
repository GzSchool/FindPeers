// pages/teampeers/teampeers.js
var app = getApp()
var util = require('../../utils/util.js');
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
    qunname: "",              //群名字
    server: "",               //服务器地址
    key: " 微信号、城市、公司、行业等进行搜索", //搜索
    chooseSize: "",           //动画
    animationData: {},        //动画
    selectAll: false,         //选择全部
    hasSelect: false,         //单个选择
    selectMyCard: true,       //分享弹出层选中自己
    click: true,              //点击
    formId: '',               //表单ID
  },
  //转发分享
  onShareAppMessage: function (a) {               //转发
    let that = this
    let otheropenId = that.data.otheropenId;
    return {
      title: '找同行',
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
  //页面初始化（只加载一次）
  onLoad: function(ops) {
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
      list: [],
      searching: true
    }) 

    var list = that.data.list;
    var server = that.data.server
    var listOfSave = that.data.listOfSave
    var openId = that.data.openid;
    var groupId = that.data.groupId;
    //获取群里用户
    util.getGroupCards(openId, groupId,1,1000).then(function(res) {
      let arr = res.data.data.result
      var length = res.data.data.result.length;
      for (var i = 0; i < arr.length; i++) {
        arr[i].isselect = false
        list.push(arr[i]);
        if (arr[i].saveFlag == 1) {
          listOfSave.push(arr[i].id)
        }
      }
      that.setData({
        list: list,
        listOfSave: listOfSave,
        searching: false
      });
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

  //动画弹出
  chooseSize: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        canSee: true
      })
      app.globalData.canSee = true
    }, 200)
  },

  //动画隐藏
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,
        cansee: true
      })
    }, 200)
  },

  //保存用户名片
  save: function (e) {
    var that = this
    that.setData({
      hasSelect: false,
      formId: e.detail.formId
    })
    var openid = app.globalData.openid;
    var listOfSave = []
    var othercardid = app.globalData.othercardid
    var groupid = that.data.groupId
    var userpeers = [];
    let list = [];
    let saveName = this.data.name;
    let activeList = [];
    let mes = that.data.list;
    let formId = that.data.formId;    
    for (let i = 0; i < mes.length; i ++) {
      if (mes[i].isselect == true) {
        activeList.push(mes[i].id)
      }
    }  
    console.log(saveName, formId)
    //保存用户  
    util.saveOrUpdate(openid, groupid, 2, activeList, saveName, formId).then(function(res) {
      util.getGroupCards(openid, groupid, 1, 1000).then(function (adc) {
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
          listOfSave: listOfSave
        });
      })
      if (res.data.success && res.statusCode == 200) {
        app.showToast('保存成功')
      }
    })
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
    console.log(e)
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
  //选择本人名片
  selectMyCards() {
    let val = this.data.selectMyCard
    this.setData({
      selectMyCard: val ? false : true
    })
  }
})