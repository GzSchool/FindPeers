const app = getApp()

Page({
  data: {
    name: "张三",
    job: "kaifa",
    company: "公司",
    telephone: "155465456",
    weChatNumber: "dsad5454",
    email: "sdsadsa4454f5s",
    adress: "是第三方"
  },
  //事件处理函数
  viewThisCards: function () {
    wx.navigateTo({
      url: '/pages/viewThis/viewThis',
    })
  }
})