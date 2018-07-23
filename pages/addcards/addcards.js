// pages/addCards/addcards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
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
    isshow:'',
    isshow0: false,
    isshow1: false,
    isshow2: false
  },
  onLoad: function(res) {
    var that = this
    that.data.server=app.globalData.server;
    if (res.other) {
      that.setData({
        
        other: res.other
      })
    }
    /*that.setData({
      openid:res.openid
    })*/
    if (res.openid) {
      that.data.openid = res.openid;
    }
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    var isshow = that.data.isshow;
    console.log(isshow)
    wx.getUserInfo({
      success:function(a){
        that.setData({
          image:a.userInfo.avatarUrl
        })
      }
    })
    wx.showActionSheet({
      itemList: ["马上添加", "暂不添加"],
      success: function(d) {
        if (d.tapIndex == 0) {
          console.log(1111);
        }
        if (d.tapIndex == 1) {
          var openid = that.data.openid
          var otheropenid=app.globalData.otheropenid
          console.log(otheropenid==null)
          if(otheropenid!=""){
          wx.navigateTo({
            url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid,
            })
          }else{
            app.globalData.notadd=false
            wx.switchTab({
            url: '/pages/findmore/findmore',
          })
          }
          
        }
      },
      fail: function() {
        console.log(openid)
        if (otheropenid != "") {
          wx.navigateTo({
            url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid + '&isshow=false',
          })
        } else {
          app.globalData.notadd = false
          wx.switchTab({
            url: '/pages/findmore/findmore',
          })
        }
      }
    })

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
      })
    } else {
      this.data.wechatnum = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcompany: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '公司名称不能为空'
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
    console.log(introduction)
  },



  save: function(e) {
    var other=this.data.other
    var server = this.data.server
    if (other) {
      if (this.data.wechatnum == "") {
        wx.showToast({
          title: '微信号不能为空',
        })
      } else if (this.data.company == "") {
        wx.showToast({
          title: '公司名称不能为空'
        })
      } else if (this.data.idustry == "") {
        wx.showToast({
          title: '行业信息不能为空',
        })
      } else if (this.data.city == "") {
        wx.showToast({
          title: '城市信息不能为空',
        })
      } else {
        wx.request({
          method: 'GET',
          data: {
            username: this.data.name,
            openId: this.data.openid,
            userWechat: this.data.wechatnum,
            userCity: this.data.city,
            userImg:this.data.image,
            userCompany: this.data.company,
            userIndustry: this.data.idustry,
            userPhone: this.data.phone,
            userJob:this.data.job,
            userJob:this.data.job,
            demande:this.data.demand,
            resources:this.data.resource,
            synopsis:this.data.introduction,
            userEmail:this.data.email
          },
          url: server+'/userCard/saveOrUpdate',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res)
            var openid = app.globalData.openid;
            console.log(openid)            
            var otheropenid = app.globalData.otheropenid;
            console.log(otheropenid)                       
            if (otheropenid!="") {
              console.log(openid) 
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?otheropenid='+otheropenid+'&isshow=true',
              })
            } else {
              console.log(openid)
              app.globalData.notadd=true;
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            }
          }
        })
      }
    } else {
      if (this.data.wechatnum == "") {
        wx.showToast({
          title: '微信号不能为空',
        })
      } else if (this.data.company == "") {
        wx.showToast({
          title: '公司名称不能为空'
        })
      } else if (this.data.idustry == "") {
        wx.showToast({
          title: '行业信息不能为空',
        })
      } else if (this.data.city == "") {
        wx.showToast({
          title: '城市信息不能为空',
        })
      } else {
        wx.request({
          method: 'GET',
          data: {
            username: this.data.name,
            openId: this.data.openid,
            userWechat: this.data.wechatnum,
            userCity: this.data.city,
            userImg: this.data.image,
            userJob: this.data.job,
            userCompany: this.data.company,
            userIndustry: this.data.idustry,
            userPhone: this.data.phone,
            userJob: this.data.job,
            demande: this.data.demand,
            resources: this.data.resource,
            synopsis: this.data.introduction,
            userEmail: this.data.email
          },
          url: server+'/userCard/saveOrUpdate',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res)
            var openid = app.globalData.openid;
            var otheropenid = app.globalData.otheropenid;
            if (otheropenid!="") {
              app.globalData.notadd=true;
              wx.navigateTo({
                url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid + '&isshow=true',
              })
              /*
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })*/
            } else {
              app.globalData.notadd = true;
              wx.switchTab({
                url: '/pages/findmore/findmore',
              })
            }
          }
        })
      }
    }
  }

})