// pages/ganerate/ganerate.js
import { promisify } from '../../utils/index.js'
Page({
  data: {
  
  },
  onLoad: function (options) {
    // const ctx = wx.createCanvasContext('ganerate')
    // ctx.setFillStyle('blue')
    // ctx.draw()
    // console.log(ctx)

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
  }
})