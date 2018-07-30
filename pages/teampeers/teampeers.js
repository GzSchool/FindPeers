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
    notadd:"",
    isAdd:"",
    canSee:"",
    listOfSave: [],
    isChecked: "",
    isAllChecked: "",
    job:"",
    qunname:"格致文化",
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
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    console.log(ops)
    var that = this
    that.setData({
      server: app.globalData.server,
      openid: ops.openid,
      groupId: ops.groupid,
      notadd:app.globalData.notadd,
      canSee:app.globalData.canSee,
      list:[]
    })
    console.log(that.data.notadd)
    var list = that.data.list;
    var server = that.data.server
    var listOfSave=that.data.listOfSave
    var openId = that.data.openid;
    var groupId = that.data.groupId;
    util.getGroupCards(openId, groupId).then(function(res){
      var length = res.data.data.length;
      for (var i = 0; i < length; i++) {
        list.push(res.data.data[i]);
        if (res.data.data[i].saveFlag == 1) {
          listOfSave.push(res.data.data[i].id)
        }
      }
      that.setData({
        list: list,
        listOfSave: listOfSave
      });
      that.setData({
        hidden: true
      });
    })
    /*wx.request({
      method: 'GET',
      url: app.globalData.server + '/userGroup/findGroupCards',
      data: {
        openId: that.data.openid,
        groupId: that.data.groupId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        var length = b.data.data.length
        for (var i = 0; i < length; i++) {
          list.push(b.data.data[i]);
          if (b.data.data[i].saveFlag == 1) {
            listOfSave.push(b.data.data[i].id)
            console.log(b.data.data[i].id)
          }
        }
        console.log(list)
        console.log(listOfSave)
        that.setData({
          list: list,
          listOfSave: listOfSave
        });
        that.setData({
          hidden: true
        });
      }
    })*/
    util.getMyData(openId).then(function(res){
      if (res !== null) {
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
    /*wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',

      data: {
        openId: that.data.openid
      },

      header: {
        'content-type': 'application/json'
      },
      success: function (c) {
        console.log(c)
        if(c.data.data!==null){
          that.setData({
            canSee:false,
            name: c.data.data.username,
            wechatnum: c.data.data.userWechat,
            company: c.data.data.userCompany,
            job: c.data.data.userJob,
            industry: c.data.data.userIndustry,
            city: c.data.data.userCity,
            email: c.data.data.userEmail,
            phone: c.data.data.userPhone,
            image: c.data.data.userImg,
          })
          console.log(that.data.canSee)
        }else{
          that.data.canSee=true
          console.log(that.data.canSee)
        }
        console.log(that.data.canSee)
      }
    })*/
  },
  share: function () {
    var that = this
    var openid = this.data.openid
    var groupid = this.data.groupid
    var server = that.data.server
    wx.showModal({
      title: '分享到本群',
      content: '确定分享到本群',
      success: function (r) {
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
            success: function (a) {
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
  mycards: function () {
    wx.navigateTo({
      url: '/pages/mycards/mycards?back=true',
    })
  },
  checkboxChange: function (a) {
    if(a.type=="change"){

    }
    console.log(a)
    
  },
  check:function(a){
  },
  chooseSize: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        canSee:true
      })
      app.globalData.canSee=true
    }, 200)
  },
  hideModal: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,
        cansee: true
      })
    }, 200)
  },
  checkboxChange: function (e) {
    var that = this
    console.log(e)
    var id = that.data.id;
    var listOfSave = that.data.listOfSave
    var length1 = e.detail.value.length
    var length2 = listOfSave.length
    console.log(length1)
    console.log(length2)    
    if (length1 >=length2) {
      that.setData({
        isAllChecked: false,
        isChecked: false,
        id: []
      })
      

    } else {
      for (var i = 0; i < listOfSave.length; i++) {
        id.push(listOfSave[i])
        console.log(listOfSave[i])
      }
      that.setData({
        isAllChecked: true,
        isChecked: true,
        id: id
      })
    }
    console.log(id)
  },
  aaa:function(e){
    var that = this
    var server = app.globalData.server;
    var openid = app.globalData.openid;
    var othercardid = app.globalData.othercardid
    console.log(othercardid)
    var groupid=that.data.groupid
    var id=that.data.id
    console.log(id)
    
    console.log(groupid)
    var userpeers=[];
    util.saveOrUpdate(openid,groupid,2,id).then(function(res){
      that.setData({
        isAdd: true
      })
    })
    /*wx.request({
      method: 'POST',
      url: server + '/userPeer/saveOrUpdate',
      data: {
        openId: openid,
        cardIds: id,
        saveFlag: 2,
        groupId:groupid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          isAdd:true
        })
        console.log(res)
      }
    })*/
  },
  goPeers:function(e){
    console.log(e)
    var cardId=e.currentTarget.dataset.id;
    var groupId = this.data.groupId;    
    console.log(cardId) 
    wx.navigateTo({
      url: '/pages/otherpeers/otherpeers?cardId=' + cardId + '&groupId=' + groupId,
    })
  },
  inputSearch:function(){
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  addcards: function (e) {
    var othercardid = app.globalData.othercardid;
    var openid=app.globalData.openid;
    var groupId=this.data.groupId
    console.log(groupId)
    console.log(othercardid !== "")
    if (e.detail.userInfo) {
      wx.redirectTo({
        url: '/pages/addcards/addcards?back=true' +'&groupId='+groupId+'&openid='+openid,
      })
    }
  }
})