// pages/teampeers/teampeers.js
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    openid: "",
    groupId: "",
    list: [],
    name: "",
    id: [],
    notadd: "",
    isAdd: "",
    canSee: "",
    listOfSave: [],
    isChecked: "",
    isAllChecked: "",
    job: "",
    qunname: "格致文化",
    server: "",
    city: "",
    key: " 微信号、城市、公司、行业等进行搜索",
    industry: "",
    company: "",
    phone: "",
    wechatnum: "",
    emai: "",
    image: "/pages/images/1.png",
    chooseSize: "",
    animationData: {},
    selectAll: false,
    hasSelect: false,
    selectMyCard: true, //分享弹出层选中自己
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(ops) {
    console.log(ops)
    var that = this
    that.setData({
      server: app.globalData.server,
      openid: ops.openid,
      groupId: ops.groupid,
      notadd: app.globalData.notadd,
      canSee: app.globalData.canSee,
      list: []
    })
    console.log(that.data.notadd)
    var list = that.data.list;
    var server = that.data.server
    var listOfSave = that.data.listOfSave
    var openId = that.data.openid;
    var groupId = that.data.groupId;
    util.getGroupCards(openId, groupId, 1, 20).then(function(res) {
      var length = res.data.data.result.length;
      console.log(res.data.data)
      for (var i = 0; i < length; i++) {
        res.data.data.result[i].isselect = false
        // res.data.data[i].index = i
        list.push(res.data.data.result[i]);
        if (res.data.data.result[i].saveFlag == 1) {
          listOfSave.push(res.data.data.result[i].id)
        }
      }
      that.setData({
        list: list,
        listOfSave: listOfSave
      });
      console.log(that.data.listOfSave)
      that.setData({
        hidden: true
      });
    })
    util.getMyData(openId).then(function(res) {
      if (res) {
        that.setData({
          canSee: false,
          name: res.username,
          wechatnum: res.userWechat,
          company: res.userCompany,
          job: res.userJob,
          industry: res.userIndustry,
          city: res.userCity,
          email: res.userEmail,
          phone: res.userPhone,
          image: res.userImg,
        })
      } else {
        that.data.canSee = true
      }
    })
  },
  share: function() {
    var that = this
    var openid = this.data.openid
    var groupid = this.data.groupid
    var server = that.data.server
    wx.showModal({
      title: '分享到本群',
      content: '确定分享到本群',
      success: function(r) {
        if (r.confirm) {
          wx.request({
            method: 'GET',
            url: server + '/userGroup/saveOrUpdate',

            data: {
              openId: openid,
              groupId: groupid
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(a) {
              console.log(a)
              that.setData({
                cansee: true
              })
            }
          })
        }
      }
    })
  },
  mycards: function() {
    var groupId = this.data.groupId;
    wx.navigateTo({
      url: '/pages/mycards/mycards?back=true' + '&groupId=' + groupId,
    })
  },
  checkboxChange: function(a) {
    if (a.type == "change") {

    }
    console.log(a)

  },
  check: function(a) {},
  chooseSize: function(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
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
  aaa: function (e) {
    let activeList = []
    let list = this.data.list
    for (let i = 0; i< list.length; i ++) {
      if (list[i].isselect == true) {
        activeList.push(list[i].id)
      }
    }
    console.log(activeList)
    var that = this
    console.log(app)
    var server = app.globalData.server;
    var openid = app.globalData.openid;
    var othercardid = app.globalData.othercardid
    // console.log(othercardid)
    var groupid = that.data.groupId
    var id = that.data.id
    // console.log(id)
    // console.log(groupid)
    var userpeers = [];
    util.saveOrUpdate(openid, groupid, 2, activeList).then(function(res) {
      console.log(res)
      if (res.data.success && res.statusCode == 200) {
        that.setData({
          selectMyCard:false
        })
        app.showToast('保存成功')
      }
    })
  },
  goPeers: function(e) {
    console.log(e)
    var cardId = e.currentTarget.dataset.id;
    var groupId = this.data.groupId;
    var saveFlag = e.currentTarget.dataset.saveflag;
    console.log(e.currentTarget.dataset.saveflag)
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=' + groupId + '&back=true' + '&saveFlag=' + saveFlag,
    })
  },
  inputSearch: function() {
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  addcards: function(e) {
    var othercardid = app.globalData.othercardid;
    var openid = app.globalData.openid;
    var groupId = this.data.groupId
    console.log(groupId)
    console.log(othercardid)
    if (e.detail.userInfo) {
      wx.redirectTo({
        url: '/pages/addcards/addcards?back=true' + '&groupId=' + groupId + '&openid=' + openid,
      })
    }
  },
  selectAll: function() {
    let val = this.data.selectAll
    console.log(val)
    let list = this.data.list
    for (let i = 0; i < list.length; i++) {
      list[i].isselect = val ? false : true
    }
    console.log(list)
    this.setData({
      selectAll: val ? false : true,
      hasSelect: val ? false : true,
      list: list
    })
  },
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
  selectMyCards() {
    let val = this.data.selectMyCard
    this.setData({
      selectMyCard: val ? false : true
    })
  }
})