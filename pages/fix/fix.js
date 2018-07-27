// pages/mycards/mycards.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myJob: [
      {
        "value": "广告/传媒/文化",
        data: ["广告/公关/会展", "影视/媒体", "文化/艺术/出版"],
      },
      {
        "value": "专业服务",
        data: ["咨询", "人才服务", "外包服务", "法律", "检测/认证", "专利/知识产权/商标", "财务/审计/税务"],
      },
      {
        "value": "金融",
        data: ["银行", "保险", "信托", "基金", "期货", "租凭", "证券", "投资/融资", "担保/典当/拍卖"],
      },
      {
        "value": "互联网/IT",
        data: ["计算机软件", "系统集成/IT服务", "互联网", "O2O", "互联网金融", "在线教育", "医疗服务", "网游/手游", "社交网络/SNS", "云计算/大数据", "在线旅游", "移动互联网", "电子商务", "智能硬件", "网络安全", "网络招聘"],
      },
      {
        "value": "电子/通信/硬件",
        data: ["计算机硬件/网络设备", "通信设备", "运营商增值服务", "电子/半导体/集体电路", "运营商/增值服务"],
      },
      {
        "value": "生活服务",
        data: ["餐饮", "中介服务", "旅游", "汽车租凭", "酒店", "丽人/美容/美发", "娱乐/休闲/体育", "婚庆/摄影"],
      },
      {
        "value": "交通/贸易/物流",
        data: ["贸易进出口", "交通/运输", "物流/仓储"],
      },
      {
        "value": "汽车",
        data: ["汽车生产", "汽车零配件", "汽车维修/保养/美容", "汽车销售", "汽车用品"],
      },
      {
        "value": "机械/制造",
        data: ["航空/航天", "摩托车/电动车/自行车", "原材料加工/摸具", "仪器/仪表/工业自动化", "印刷/包装/造纸", "机械制造/机电/重工"],
      },
      {
        "value": "能源/化工/环保",
        data: ["石油/石化/化工", "矿产/地质/采掘/冶炼", "电力/水利", "环保", "新能源（太阳能/风能）"],
      },
      {
        "value": "教育/培训",
        data: ["院校", "IT培训", "其他技能培训", "外语培训", "学前教育", "学术/科研"],
      },
      {
        "value": "消费品",
        data: ["零售（超市）/批发", "食品/饮料/烟酒/日化", "家电", "玩具/礼品", "办公用品及设备", "服装/服饰/纺织/皮革", "奢侈品/收藏品", "家具/家居", "珠宝/首饰/工艺品"],
      },
      {
        "value": "制药/医疗",
        data: ["制药（生物/化学）", "医疗卫生", "医疗器械"],
      },
      {
        "value": "农/林/牧/渔业/其他",
        data: ["养殖/种植/水产", "饲料/添加剂", "种子/化肥/农药", "其他"],
      },
      {
        "value": "政府/非营利机构",
        data: ["政府/公共事业", "非营利机构"],
      }
    ],
    name: "",
    other: '',
    wechatnum: "",
    company: "",
    idustry: "",
    job: '',
    back:"",
    server: "",
    id: '',
    city: "",
    phone: "",
    demand: "",
    introduction: "",
    resource: "",
    email: "",
    isshow: '',
    isshow0: false,
    isshow1: false,
    isshow2: false,
    image: "/pages/images/1.png",
    showphone: false,
    showdemand: false,
    showresource: false,
    showintroduction: false
  },
  onLoad: function(a) {
    var that = this
    console.log(a)
    that.data.server = app.globalData.server
    wx.showShareMenu({
      withShareTicket: true
    })
    if(a.back){
      that.setData({
        back:true
      })
    }
    that.data.openid = app.globalData.openid;
    var openid = that.data.openid;
    console.log(openid)
    var server = that.data.server
    wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        console.log(b)
        that.setData({
          name: b.data.data.username,
          wechatnum: b.data.data.userWechat,
          company: b.data.data.userCompany,
          idustry: b.data.data.userIndustry,
          city: b.data.data.userCity,
          email: b.data.data.userEmail,
          phone: b.data.data.userPhone,
          image: b.data.data.userImg,
          demand: b.data.data.demand,
          resource: b.data.data.resources,
          introduction: b.data.data.synopsis,
          id: b.data.data.id,
          job: b.data.data.userJob
        })
      }
    })
  },
  viewThisCards: function() {
    var openid = app.globalData.openid;
    wx.navigateTo({
      url: '/pages/viewThis/viewThis?openid=' + openid,
    })
  },
  addmore: function() {
    var that = this
    wx.showActionSheet({
      itemList: ["需求", "资源", "邮箱"],
      success: function(res) {
        if (res.tapIndex == 0) {
          that.setData({
            isshow0: true
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            isshow1: true
          })
        } else {
          that.setData({
            isshow2: true
          })
        }
      }
    })
  },
  addname: function(e) {
    console.log(e)
    if (e.detail.value == null) {

    } else {
      this.data.name = e.detail.value
    }
  },
  addnumber: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '微信号不能为空',
      })
    } else {
      this.data.wechatnum = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcompany: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else {

      this.data.company = e.detail.value
      console.log(e.detail.value)
    }
  },
  addidustry: function(e) {
    var that = this
    var server = that.data.server
    if (e.detail.value == null) {
      wx.showToast({
        title: '行业信息不能为空',
      })
    } else {

      this.data.idustry = e.detail.value
      console.log(e.detail.value)
    }
  },
  addcity: function(e) {
    if (e.detail.value == null) {
      wx.showToast({
        title: '城市信息不能为空',
      })
    } else {

      this.data.city = e.detail.value
      console.log(e.detail.value)
    }
  },
  addjob: function(e) {
    this.data.job = e.detail.value
  },
  addphone: function(e) {

    this.data.phone = e.detail.value
    console.log(e.detail.value)
  },
  adddemand: function(e) {

    this.data.demand = e.detail.value
    console.log(e.detail.value)
  },
  addresource: function(e) {

    this.data.resource = e.detail.value
    console.log(e.detail.value)
  },
  addemail: function(e) {

    this.data.email = e.detail.value
    console.log(e.detail.value)
  },
  addintroduction: function(e) {

    this.data.introduction = e.detail.value
    console.log(introduction)
  },
  save: function(e) {
    var server = app.globalData.server
    var that=this
    if (this.data.wechatnum == null) {
      wx.showToast({
        title: '微信号不能为空',
      })
    } else if (this.data.company == null) {
      wx.showToast({
        title: '公司名称不能为空'
      })
    } else if (this.data.idustry == null) {
      wx.showToast({
        title: '行业信息不能为空',
      })
    } else if (this.data.city == null) {
      wx.showToast({
        title: '城市信息不能为空',
      })
    } else {
      wx.request({
        method: 'GET',
        data: {
          id: this.data.id,
          username: this.data.name,
          openId: this.data.openid,
          userWechat: this.data.wechatnum,
          userCity: this.data.city,
          userCompany: this.data.company,
          userIndustry: this.data.idustry,
          userPhone: this.data.phone,
          userJob: this.data.job,
          userJob: this.data.job,
          demand: this.data.demand,
          resources: this.data.resource,
          synopsis: this.data.introduction,
          userEmail: this.data.email
        },
        url: server + '/userCard/saveOrUpdate',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var back = that.data.back;
          console.log(back)
          if (back){
            wx.navigateBack({
              delta:2
            })
          }else{
            wx.switchTab({
              url: '/pages/findmore/findmore',
            })
          }                   
        }
      })
    }

  },
  getPhoneNumber: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {
          console.log(res)

        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {
          console.log(res)
        }
      })
    }
  },
  chooseSize: function(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),

      })
    }, 200)
  },
  hideModal: function(e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,
        cansee: true
      })
    }, 200)
  },
  select: function(e) {
    console.log(e)
    var industry = e.currentTarget.dataset.value;
    this.setData({
      idustry: industry
    })
    this.hideModal();
  },
  select: function(e) {
    console.log(e)
    var industry = e.currentTarget.dataset.value;
    this.setData({
      idustry: industry
    })
    this.hideModal();
  }
})