// pages/addCards/addcards.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
addmore:function(){
  wx.showActionSheet({
    itemList: ["需求","资源","邮箱"],
    success:function(res){
      if(res.tapIndex == 0){
        this.setData({
          
        })
      }
    }
  })
  
}
 
})