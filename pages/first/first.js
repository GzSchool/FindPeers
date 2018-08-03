const app = getApp()

Page({
  data: {
    name: "杜康辉",
    job: "前端开发工程师",
    company: "格致文化传播有限公司",
    telephone: "13439172831",
    weChatNumber: "adkh",
    email: "dkh_321@163.com",
    adress: "北京市海淀区"
  },
  //事件处理函数
  viewThisCards: function () {
    wx.navigateTo({
      url: '/pages/viewThis/viewThis',
    })
  }
})