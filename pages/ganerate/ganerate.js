// pages/ganerate/ganerate.js
import { promisify } from '../../utils/index.js'
let util = require('../../utils/util.js')
let app = getApp()
Page({
  data: {
    mineInfo: {
      name: '',
      idustry: '',
      city: '',
      company: '',
      phone: '',
      wechatnum: '',
      email: '',
      userJob: '',
      id: '',
    },
    id:'',
    width: '',
    height: '',
    r_px: ''
  },
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高
      success: function (res) {
        console.log(res)
        that.setData({
          width: 0.8*res.windowWidth,
          height: 0.8*res.windowHeight,
          r_px: res.windowWidth/750
        })
      }
    })
    console.log(that.data)
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options)
    // const ctx = wx.createCanvasContext('ganerate')
    // ctx.setFillStyle('blue')
    // ctx.draw()
    // console.log(ctx)
    that.setData({
      id:options.id
    })
    that.getMyData()
    util.getDataById(this.data.id).then(function(res){
      console.log(res)
    })
    const wxGetImageInfo = promisify(wx.getImageInfo)
    Promise.all([
      wxGetImageInfo({
        src: 'http://pic.97uimg.com/gallery_big/03/93/86/62/63/558f072d7c4c5.jpeg'
      }),
      wxGetImageInfo({
        src: 'http://www.eqxuan.cn/o5Z7M4vcelivChdKg8r8kwqQWaJE.png'
      })
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareCanvas')
      ctx.drawImage(res[0].path, 0, 0, 300, 500)
      ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#111111')  // 文字颜色：黑色
      ctx.setFontSize(18)         // 文字字号：22px
      ctx.fillText("李盼", 300 / 2, 250)
      ctx.fillText("设计", 300 / 2, 280)
      const qrImgSize = 90
      ctx.drawImage(res[1].path, 28, 350, qrImgSize, qrImgSize)
      ctx.stroke()
      ctx.draw()
    })
    
  },
  save () {
    const wxCanvasToTempFilePath = promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册'
      })
    })
  },
  makeQRCode(){
    let openid = app.globalData.openid;
    let id = this.data.id;
    let userImg = this.data.image;
    let page = 'pages/peerscards/peerscards';
    util.makeWxQrCode(userImg, id, page, openid, id, 'makeWxQrCode').then(function(res){
      console.log(res)
    })
  },
  //转发分享
  onShareAppMessage: function (a) {
    var that = this
    return {
      title: '名片Live',
      path: '/pages/findmore/findmore',
      success: function (res) {
        let openId = app.globalData.openid;
        let otherOpenId = app.globalData.openid;
        util.sharePage(openId, otherOpenId, res).then(function (e) {
          console.log(e)
        })
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      }
    }
  },
  getMyData() {
    let that = this
    util.getDataById(that.data.id).then(function (res) {
      console.log('==++')
      console.log(res)
      that.setData({
        mineInfo: {
          name: res.data.data.username,
          idustry: res.data.data.userIndustry,
          city: res.data.data.userCity,
          company: res.data.data.userCompany,
          phone: res.data.data.userPhone,
          wechatnum: res.data.data.userWechat,
          email: res.data.data.userEmail,
          userJob: res.data.data.userJob,
          id: res.data.data.id,
        },
        name: res.data.data.username,
        wechatnum: res.data.data.userWechat,
        company: res.data.data.userCompany,
        idustry: res.data.data.userIndustry,
        city: res.data.data.userCity,
        email: res.data.data.userEmail,
        phone: res.data.data.userPhone,
        image: res.data.data.userImg,
        id: res.data.data.id,
        demand: res.data.data.demand,      //需求
        resources: res.data.data.resources,//资源
        synopsis: res.data.data.synopsis,  //简介
        userJob: res.data.data.userJob,     // 职位
        homepage: res.data.data.homePage,    //个人主页
        companyWeb: res.data.data.companyPage, //公司主页
        cardType: res.data.data.cardType,
      })
    })
  }
})