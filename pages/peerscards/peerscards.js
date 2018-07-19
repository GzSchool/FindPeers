// pages/peerscards/peerscards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "朝木",
    adress: "北京市海淀区",
    idustry: "互联网",
    company: "北京格致文化传媒有限公司",
    phone: "18793654210",
    wechatnum: "cmlg",
    image:"/pages/images/1.png",
    email:"2415d454@sd5.com",
    isshow: true
  },
  onLoad:function(ops){
    this.setData({
      id:ops.id,
      isshow:ops.ishow
    })
    wx.request({
      method: 'GET',
      url: '',
      data:{
        id:ops.id
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        this.setData({
          name:res.data.name,
          adress:res.data.city,
          idustry:res.data.idutry,
          image:res.data.img,
          company:res.data.company,
          phone:res.data.phone,
          wechatnum:res.data.wechatNum,
          email:res.data.email
        })
      }
    })
  },
  addcards:function(){
    
  },
  setting:function(a){
    wx.showActionSheet({
      itemList: ["转发","保存至通讯录","删除同行信息"],
      success:function(b){
        if(b.tapIndex==0){

        }else if(b.tapIndex==1){

        }else{
          
        }
      }
    })
  },
  remove:function(){
    var id=this.data.id
    wx.request({
      method: 'GET',
      url: '',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){

      }
    })
  }

})