// pages/findmore/findmore.js
var app=getApp()
Page({
  data: {
    name: '',
    job: '',
    wechatnum:'',
    othercardid:"",
    key:"微信号，行业，城市等进行搜索",
    company:'',
    openid: '',
    notadd: "",
    idustry:'',
    openid:'',
    city:'',
    emai:'',
    phone:'',
    image:'',
    server:"",
    list: [],
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (a) {
    console.log(a)
    var that = this;
    that.data.notadd=app.globalData.notadd
    that.setData({
      server:app.globalData.server,
      othercardid: app.globalData.othercardid
    })
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.setData({
      list:[]
    })
    var notad=app.globalData.notadd;
    that.data.openid=app.globalData.openid;
    var openid = app.globalData.openid;
    console.log(openid)
    var server=that.data.server
    console.log(that.data.server + '/userCard/findOneByOpenId')    
    wx.request({
      method: 'GET',
      url: server+'/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        console.log(b)
        if(b.data.data==null||b.data.data==""){
          console.log(b.data.data==null)
          that.setData({
            notadd:true
          })
          app.globalData.notadd = true
        }
        else{
          that.data.notadd = false
          app.globalData.notadd=false
          app.globalData.isshow=true
          that.setData({
            name: b.data.data.username,
            wechatnum: b.data.data.userWechat,
            company: b.data.data.userCompany,
            idustry: b.data.data.userIndustry,
            city: b.data.data.userCity,
            emai: b.data.data.userEmail,
            phone: b.data.data.userPhone,
            image: b.data.data.userImg,
          })
        }
      }
    })
    var openid=app.globalData.openid;
    var list = that.data.list
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server+'/userPeer/findAllByOpenId',
      data: {
        openId: openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);        
        console.log(res.data.data.length);
        var length = res.data.data.length;
        for (var i = 0; i < length; i++) {
          list.push(res.data.data[i]);
          console.log(list[i])
        }
        /*for(var i in res.data.data){
          var a=res.data.data[i]
            list.push(a)
        }*/
        console.log(list)
        that.setData({
          list: list
        });
        console.log(list);        
        that.setData({
          hidden: true
        });
      }
    });
  },
  trans: function () {
    wx.navigateTo({
      url: '/pages/company/company',
    })
  },
  mycards: function () {
    var openid=app.globalData.openid
    wx.navigateTo({
      url: '/pages/mycards/mycards?openid=' + openid,
    })
  },
  peerscards: function () {
    wx.navigateTo({
      url: '/pages/peerscards/peerscards',
    })
  },
  addcards:function(){
    var othercardid=app.globalData.othercardid;
    console.log(othercardid!=="")
    wx.getSetting({
      success: function (b) {
        if (b.authSetting['scope.userInfo']) { 
      
      var openid = app.globalData.openid
      var othercardid = app.globalData.othercardid
      wx.redirectTo({
        url: '/pages/addcards/addcards',
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '需要添加信息请您先授权',
        showCancel: false,
        confirmText: '知道了',
        success: function (a) {
          wx.navigateTo({
            url: '/pages/index/index?',
          })
        }
      })
    }
        }
      })
    
  },
  bindtrans:function(){
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  select:function(a){
    var otheropenid = a.currentTarget.dataset.key;
    var cardId = a.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/peerscards/peerscards?cardId=' + cardId +'&isshow=true',
    })
  },
  onShow:function(){
    this.onLoad();
  }
})