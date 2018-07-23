// pages/findmore/findmore.js
var app=getApp()
Page({
  data: {
    name: '张三',
    job: 'java',
    wechatnum:'',
    key:"微信号，行业，城市等进行搜索",
    company:'',
    openid: '',
    notadd: 'true',
    idustry:'',
    openid:'',
    city:'',
    emai:'',
    phone:'',
    image:'',
    list: [],
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function (a) {
    console.log(a)
    var that = this;
    that.setData({
      notadd:app.globalData.notadd
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
    that.data.notadd=app.globalData.notadd;
    that.data.openid=app.globalData.openid;
    var openid=that.data.openid
    console.log(openid)
    console.log(that.data.notadd)    
    wx.request({
      method: 'GET',
      url: 'https://192.168.2.123:8080/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        if(b.data.data!=null){
          app.globalData.notadd=true
          that.data.notadd=true
        }
        console.log(b)
        that.setData({
          name:b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          emai: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
          
        })
        
        console.log(that.data)
      }
    })
    var openid=app.globalData.openid;
    var list = that.data.list
    wx.request({
      method: 'GET',
      url: 'https://192.168.2.123:8080/userPeer/findAllByOpenId',
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
        /*for (var i = 0; i < length; i++) {
          list.push(res.data.data[i]);
          console.log(list[i])
        }*/
        for(var i in res.data.data){
          var a=res.data.data[i]
            list.push(a)
        }
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
    var login = app.globalData.login;
    console.log(login)
    if (login) {
      var openid = app.globalData.openid
      var otheropenid = app.globalData.otheropenid
      if(otheropenid){
      wx.redirectTo({
        url: '/pages/addcards/addcards?openid=' + openid,

      })
      }else{
        wx.navigateTo({
          url: '/pages/addcards/addcards?otheropenid=' + otheropenid+'&other=true',
        })
      }
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '需要添加信息请您先授权',
        showCancel: false,
        confirmText: '知道了',
        success: function (a) {
          wx.navigateTo({
            url: '/pages/index/index?openid=' + openid + '&other=true' + 'other=true',
          })
        }
      })
    }
    
  },
  bindtrans:function(){
    wx.navigateTo({
      url: '/pages/inputSearch/inputSearch',
    })
  },
  select:function(a){
    var otheropenid = a.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/peerscards/peerscards?otheropenid=' + otheropenid +'&isshow=true',
    })
  },
  onShow:function(){
    this.onLoad();
  }
})