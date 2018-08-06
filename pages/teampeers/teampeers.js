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
    image: "",
    chooseSize: "",
    animationData: {},
    selectAll: false,
    hasSelect: false,
    selectMyCard: true, //分享弹出层选中自己
    click:true
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
    let arr = []
    util.getGroupCards(openId, groupId).then(function(res) {
      // arr = res.data.data.result
      console.log(res.data)
      var length = res.data.data.length;
      console.log(res.data.data)
      for (var m = 0; m < length; m ++) {
        if (res.data.data[m].saveFlag !==  2) {
          arr.push(res.data.data[m])
        }
      }
      for (var n = 0; n < length; n++) {
        if (res.data.data[n].saveFlag == 2) {
          arr.push(res.data.data[n])
        }
      }
      for (var i = 0; i < arr.length; i++) {
        arr[i].isselect = false
        list.push(arr[i]);
        if (arr[i].saveFlag == 1) {
          listOfSave.push(arr[i].id)
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
    var server = app.globalData.server;
    wx.showModal({
      title: '分享到本群',
      content: '确定分享到本群',
      success: function(r) {
        if (r.confirm) {
          // wx.request({
          //   method: 'POST',
          //   url: server + '/userGroup/saveOrUpdate',
          //   data: {
          //     openId: openid,
          //     groupId: groupid
          //   },
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function(a) {
          //     console.log(a)
              that.setData({
                cansee: true
              })
          //   }
          // })
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
    this.setData({
      hasSelect:false
    })
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
    var openid = app.globalData.openid;
    var listOfSave = []
    var othercardid = app.globalData.othercardid
    var groupid = that.data.groupId
    var userpeers = [];
    list=[];
    util.saveOrUpdate(openid, groupid, 2, activeList).then(function(res) {
      util.getGroupCards(openid, groupid, 1, 50).then(function (adc) {
        var length = adc.data.data.result.length;
        console.log(adc.data.data)
        for (var i = 0; i < length; i++) {
          adc.data.data.result[i].isselect = false
          // res.data.data[i].index = i
          list.push(adc.data.data.result[i]);
          if (adc.data.data.result[i].saveFlag == 1) {
            listOfSave.push(adc.data.data.result[i].id)
          }
        }
        that.setData({
          list: list,
          listOfSave: listOfSave
        });
        console.log(that.data.list)
        console.log(that.data.listOfSave)
        that.setData({
          hidden: true
        });
      })
      if (res.data.success && res.statusCode == 200) {
        app.showToast('保存成功')
      }
    })
  },
  goPeers: function(e) {
    var cardId = e.currentTarget.dataset.id;
    var groupId = this.data.groupId;
    var saveFlag = e.currentTarget.dataset.saveflag
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=' + groupId + '&back=true&saveFlag=' + saveFlag,
    })
  },
  inputSearch: function() {
    // wx.navigateTo({
    //   url: '/pages/inputSearch/inputSearch',
    // })
    var groupid = this.data.groupId
    wx.navigateTo({
      url: '/pages/searchInGroup/searchInGroup?groupid=' + groupid,
    })
  },
  addcards: function(e) {
    var othercardid = app.globalData.othercardid;
    var openid = app.globalData.openid;
    var groupId = this.data.groupId
    if (e.detail.userInfo) {
      wx.redirectTo({
        url: '/pages/addcards/addcards?back=true' + '&groupId=' + groupId + '&openid=' + openid,
      })
    }
  },
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