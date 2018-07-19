Page({
  globalData: {
    session_Key: null,
    userInfo:null
  },
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId:"",
    id:"1",
    isshow:""
  },
  onLoad: function (ops) {
    if(ops.openid){
      this.setData({
        openId: ops.openid,
      })
    }else{
      this.setData({
        id:ops.id
      })
    }
  },
  bindGetUserInfo: function (e) {
    wx.request({
      method: 'GET',
      //url: 'http://192.168.2.150:8766/userCard/findOne',

      data: {
        openId:this.data.opeId
      },

      header: {
        'content-type': 'application/json'
      },
      success:function(a){
        var id=this.data.id
        if(id){
          wx.redirectTo({
            url: '/pages/peerscards/peerscards?id=id&ishow=false',
          })
        }else{
          wx.redirectTo({
            url: '/pages/mine/mine',
          })
        }
        
      }
    })
  },
failToget:function(e){
  if(id){
    wx.redirectTo({
      url: '/pages/peercards/peerscards?id=id&isshow=false',
    })
  }else{
  wx.navigateTo({
    url: '/pages/mine/mine',
  })
  }
}
})