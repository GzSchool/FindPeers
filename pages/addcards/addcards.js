// pages/addCards/addcards.js
var app = getApp();
Page({
  data: {
    count: 0,
    openid: "",
    othercardid:"",
    groupId:"",
    userId: 0,
    name: "",
    other: '',
    wechatnum: "",
    image:"",
    company: "",
    idustry: "",
    job:'',
    city: "",
    phone: "",
    server:"",
    demand: "",
    introduction: "",
    resource: "",
    email: "",
    back:"",
    isshow:'',
    isshow0: false,
    isshow1: false,
    isshow2: false
  },
  onLoad: function(res) {
    console.log(res.job)
    var that = this
    // this.setData({
    //   idustry: res.job
    // })
    that.data.server=app.globalData.server;
    that.data.openid = app.globalData.openid;
    that.data.isshow=app.globalData.isshow;
    that.data.othercardid = app.globalData.othercardid;    
    var openid = that.data.openid;
    var isshow = that.data.isshow;
    if(res.back){
      that.setData({
        back:true,
        openid: res.openid,
        groupId: res.groupId,
      })
    }else{
      that.setData({
        back: false,
        openid: res.openid,
        groupId: res.groupId,
      })
    }
    console.log(openid)
    console.log(that.data.groupId)    
    wx.getUserInfo({
      success:function(a){
        that.setData({
          image:a.userInfo.avatarUrl
        })
      }
    })
    /*if(app.globalData.othercardid){
    wx.showActionSheet({
      itemList: ["马上添加", "暂不添加"],
      success: function(d) {
        if (d.tapIndex == 0) {
          console.log(1111);
        }
        if (d.tapIndex == 1) {
          var openid = that.data.openid
          var othercardid = app.globalData.othercardid
          console.log(othercardid==null)
          if (othercardid!=""){
            that.globalData.isshow = false
          wx.navigateTo({
            url: '/pages/peerscards/peerscards?othercardid=' + othercardid,
            })
          }else{
            wx.switchTab({
            url: '/pages/findmore/findmore',
          })
          }
          
        }
      },
      fail: function() {
        console.log(openid)
        if (othercardid != "") {
          that.globalData.isshow = false
          wx.navigateTo({
            url: '/pages/peerscards/peerscards?othercardid=' + othercardid,
          })
        } else {
          wx.switchTab({
            url: '/pages/findmore/findmore',
          })
        }
      }
    })
    }else{
      wx.navigateTo({
        url: '/pages/addcards/addcards',
      })
    }*/
  },
  addmore: function() {
    var that = this
    wx.showActionSheet({
      itemList: ["需求", "资源", "邮箱"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            isshow0: true
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            isshow1: true
          })
        } else {
          that.setData({
            isshow2: true
          })
        }
      }
    })
  },
  addname: function(e) {
    console.log(e)
    if (e.detail.value == null) {
      wx.getUserInfo({
        success: function (a) {
          that.setData({
            name: a.userInfo.nickName,
            image: a.userInfo.avatarUrl
          })
        }
      })
    } else {
      this.data.name = e.detail.value
    }
  },
  addnumber: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '微信号不能为空',
        icon: 'none'
      })
    } else {
      this.data.wechatnum = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcompany: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none'
      })
    } else {

      this.data.company = e.detail.value
      console.log(e.detail.value)
    }
  },
  addidustry: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '行业信息不能为空',
        icon: 'none'
      })
    } else {

      this.data.idustry = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcity: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '城市信息不能为空',
        icon: 'none'
      })
    } else {

      this.data.city = e.detail.value
      console.log(e.detail.value)
    }
  },
  addjob:function(e){
    this.data.job=e.detail.value
  },
  addphone: function(e) {

    this.data.phone = e.detail.value
    console.log(e.detail.value)
  },
  adddemand: function(e) {

    this.data.demand = e.detail.value
    console.log(e.detail.value)
  },
  addresource: function(e) {

    this.data.resource = e.detail.value
    console.log(e.detail.value)
  },
  addemail: function(e) {

    this.data.email = e.detail.value
    console.log(e.detail.value)
  },
  addintroduction: function(e) {

    this.data.introduction = e.detail.value
  },



  save: function(e) {
    var that=this
    var othercardid = app.globalData.othercardid
    var server = this.data.server
    var back=false;
    if(this.data.back==""){
      back=false
    }else{
      back=this.data.back
    }
      if (this.data.wechatnum == "") {
        wx.showToast({
          title: '微信号不能为空',
          icon: 'none'
        })
      } else if (this.data.company == "") {
        wx.showToast({
          title: '公司名称不能为空',
          icon: 'none'
        })
      } else if (this.data.idustry == "") {
        wx.showToast({
          title: '行业信息不能为空',
          icon: 'none'
        })
      } else if (this.data.city == "") {
        wx.showToast({
          title: '城市信息不能为空',
          icon: 'none'
        })
      } else {
        wx.request({
          method: 'GET',
          data: {
            username: this.data.name,
            openId: app.globalData.openid,
            userWechat: this.data.wechatnum,
            userCity: this.data.city,
            userImg:this.data.image,
            userCompany: this.data.company,
            userIndustry: this.data.idustry,
            userPhone: this.data.phone,
            userJob:this.data.job,
            demand:this.data.demand,
            resources:this.data.resource,
            synopsis:this.data.introduction,
            userEmail:this.data.email
          },
          url: server+'/userCard/saveOrUpdate',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            app.globalData.notadd=false
            console.log(res)
            var openid = app.globalData.openid;
            console.log(openid)            
            var othercardid = app.globalData.othercardid;
            var openid = that.data.openid;
            var groupId = that.data.groupId;
            if (othercardid!="") {
              app.globalData.isshow = true
              app.globalData.notadd = false              
              console.log(openid) 
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?othercardid=' + othercardid+'&isshow=true',
              })
            } else if(back){
              app.globalData.notadd = false;
              console.log(openid);
              console.log(groupId);              
              wx.redirectTo({
                url: '/pages/teampeers/teampeers?openid='+openid+'&groupid='+groupId,
              })
            }else{
              app.globalData.notadd = false
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            }
          }
        })
      }
    },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          console.log(res)

        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
          console.log(res)
        }
      })
    }
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

      })
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
  select:function(e){
    console.log(e)
    var industry=e.currentTarget.dataset.value;
    this.setData({
      idustry:industry
    })
    this.hideModal();
  },
  introInput (e) {
    let i = e.detail.value.length
    this.setData({
      count: i
    })
  },
  chooseIn () {
    wx.navigateTo({
      url: '../industry/industry',
    })
  }
})