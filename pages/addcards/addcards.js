// pages/addCards/addcards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:0,
    name:"",
    id:"",
    wechatnum:"",
    company:"",
    idustry:"",
    city:"",
    phone:"",
    demand:"",
    introduction:"",
    resource:"",
    email:"",
    isshow0:false,
    isshow1: false,
    isshow2: false
  },
  onLoad:function(res){
    this.setData({
     // id:res.id
    })
    if(id!=null){
      wx.showActionSheet({
        itemList: ["马上添加","暂不添加"],
        success:function(d){
          if(d.tapIndex==0){
            console.log();
          }else{
            wx.navigateTo({
              url: '/pages/peerscards/peerscards?id=id',
            })
          }
        },
        fail:function(){
          wx.navigateTo({
            url: '/pages/peerscards/peerscards?id=id',
          })
        }
      })
    }
  },
addmore:function(){
  var _this=this
  wx.showActionSheet({
    itemList: ["需求","资源","邮箱"],
    success:function(res){
      if(res.tapIndex == 0){
        _this.setData({
          isshow0:true
        })
      }else if(res.tapIndex == 1){
        _this.setData({
        isshow1:true
        })
      }else{
        _this.setData({
          isshow2: true
        })
      }
    }
  }) 
},
addname:function(e){
   console.log(e)
   if(e.detail.value ==null){
      
   }else{
     this.setData({
       name:e.detail.value
     })
     console.log(e.detail.value)
   }
   },
addnumber: function (e) {
  if (e.detail.value == null) {
    wx.showToast({
      title: '微信号不能为空',
    })
  } else {
    this.setData({
      wechatnum: e.detail.value
    })
  }
},
  addcompany: function (e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else {
      this.setData({
      company: e.detail.value
      })
    }
  },
  addidustry: function (e) {
    if (e.detail.value== null) {
      wx.showToast({
        title: '行业信息不能为空',
      })
    } else {
      this.setData({
        idustry: e.detail.value
      })
    }
  },
  addcity: function (e) {
    if (e.detail.value== null) {
      wx.showToast({
        title: '城市信息不能为空',
      })
    } else {
      this.setData({
        city: e.detail.value
      })
    }
  },
  addphone: function (e) {
      this.setData({
        phone: e.detail.value
      })    
  },
  adddemand: function (e) {
    this.setData({
      demand: e.detail.value
    })
  },
  addresource: function (e) {
    this.setData({
      resource: e.detail.value
    })
  },
  addemail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  addintroduction: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  save:function(e){
    if (this.data.wechatnum == null){
      wx.showToast({
        title: '微信号不能为空',
      })
    } else if (this.data.company == null){
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else if (this.data.idustry == null){
      wx.showToast({
        title: '行业信息不能为空',
      })
    } else if (this.data.city == null){
      wx.showToast({
        title: '城市信息不能为空',
      })
    }else{
      wx.request({
        method:'GET',
        data:{
          name: this.data.name, 
          wechatnum: this.data.wechatnum,
          city: this.data.city,
          idustry: this.data.idustry,
          phone: this.data.phone,
          demand: this.data.demand,
          resource: this.data.resouce,
          email: this.data.email,
          introduction: this.data.introduction
        },
        url: '',
        header:{
          'content-type': 'application/json'
        },
        success:function(res){
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        }
      })
    }
  }
 
})