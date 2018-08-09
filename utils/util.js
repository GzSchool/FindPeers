//服务器地址
// var server = 'http://192.168.2.123:8080'
 var server = "https://www.eqxuan.cn"
 var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*
  用户登陆的时候，向后台发送用户登陆的凭证code，获取用户标识openid
*/
function Login(url) {
  return new Promise(function(resove) {
    wx.login({
      success: res => { // 发送 res.code 到后台换取 openId, sessionKey,unionId
        // 登陆成功
        if (res.code) {
          // 发起网络请求，获取微信信息
          wx.request({
            method: 'GET',
            url: server + url,
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function(a) { //后台获取openid
              resove(a.data.data.openId)
            }
          })
        }
      }
    })
  })
}
/*
  用户的openid向数据库获取信息，判断是不是再数据库里添加过数据
*/
function getMyData(openid) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userCard/findOneByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(d) {
        resolve(d.data.data);
      }
    })
  })
}

/*
  从数据库获取这个用户已经保存的同行信息
*/
function getMyPeers(openid) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userPeer/findAllPeerByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        resolve(res)
      }
    })
  })
}

/*
  从用户输入的字段从数据里模糊搜索
*/
function searchByParam(key, openid) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userCard/findAllByPeerAndParam',
      data: {
        param: key,
        openId:openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(src) {
        resolve(src)
      }
    })
  })
}

/*
  从用户输入的字段从数据里模糊搜索 当前群内用户信息
*/
function searchInGroup(key, openid, groupid) {
  return new Promise(function (resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userGroup/findAllGroupCardByParam',
      data: {
        param: key,
        openId: openid,
        groupId: groupid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (src) {
        resolve(src)
      }
    })
  })
}

/*
  用用户的id 获取用户信息
*/
function getCardsById(cardId) {
  return new Promise(function(res) {
    wx.request({
      method: 'GET',
      url: server + '/userCard/findCardByParam',
      data: {
        id: cardId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        res(b)
      }
    })
  })
}

/*
  保存同行信息跟删除同行信息 saveFlag=1时删除 saveFlag=2时是保存
*/
function saveOrUpdate(openId, groupId, saveFlag, cardIds, saveName, formId) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'POST',
      url: server + '/userPeer/saveOrUpdate',
      data: {
        openId: openId,
        cardIds: cardIds,
        saveFlag: saveFlag,
        groupId: groupId,
        saveName: saveName, // 操作者名字
        formId: formId      // formid用于推送提示
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        resolve(res)
      }
    })
  })
}

/*
  用用户openid获取用户的群信息
 */
function getUserGroupById(openid) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userGroup/findUserGroupByParam',
      data: {
        openId: openid,
        prepare:1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        resolve(b)
      }
    })
  })
}

/*
  当前用户的群里的信息
 */

function getGroupCards(openId, groupId, pageNum, pageSize) {
  return new Promise(function(resolve) {
    wx.request({
      method: 'GET',
      url: server + '/userGroup/findGroupCards',
      // url: server + '/userGroup/findCardsNoPage', //没有分页
      data: {
        openId: openId,
        groupId: groupId,
        pageNum: pageNum,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(b) {
        resolve(b)
      }
    })
  })
}
/*
  当前用户点击的名片是否已被用户保存
 */
function checkSave(openId, othercardid){
  return new Promise(function(resolve){
    wx.request({
      method: 'GET',
      url: server + '/userPeer/checkSave',
      data: {
        openId: openId,
        cardId: othercardid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (b) {
        resolve(b)
      }
    })
  })
}
/*
  分享
 */
function getOpenGid( openid, otherOpenId, shareTickets){
  return new Promise(function (resole){
    wx.getShareInfo({
      shareTicket: shareTickets[0],
      success: function (res) {
        var encryptedData = res.encryptedData;
        var iv = res.iv;
        wx.request({
          method: 'POST',
          url: server + '/userGroup/saveOrUpdate',
          data: {
            openId: app.globalData.openid,
            otherOpenId: otherOpenId,
            encryptedData: encryptedData,
            iv: iv
          },

          header: {
            'content-type': 'application/json'
          },
          success: function (c) {
          }
        })
      }
    })
  })
}
/**
 * 分享（除了几个特殊页面以外的）
 */
function sharePage(openId, otherOpenId, res){
  return new Promise(function(resolve){
      console.log(res)
      var shareTickets = res.shareTickets;
      if (shareTickets.length == 0) {
        return false;
      }
      wx.getShareInfo({
        shareTicket: shareTickets[0],
        success: function (res) {
          var encryptedData = res.encryptedData;
          var iv = res.iv;
          wx.request({
            method: 'POST',
            url: server + '/userGroup/saveOrUpdate',

            data: {
              openId: openId,
              otherOpenId: otherOpenId,
              encryptedData: encryptedData,
              iv: iv
            },

            header: {
              'content-type': 'application/json'
            },
            success: function (c) {
              console.log(c)
              resolve(c)
            }
          })
        }
      })
  })
}
/**
 * 分享转发（几个包含信息的页面）
 */
function shareToQunOrPersonal(openId, otherOpenId , res){
  return new Promise (function(resolve){
        var shareTickets = res.shareTickets;
        console.log(shareTickets)
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (b) {
            console.log(b)
            var encryptedData = b.encryptedData;
            var iv = b.iv;
            wx.request({
              method: 'POST',
              url: server + '/userGroup/saveOrUpdate',

              data: {
                openId: openId,
                otherOpenId: otherOpenId,
                encryptedData: encryptedData,
                iv: iv
              },

              header: {
                'content-type': 'application/json'
              },
              success: function (c) {
                console.log(c)
                resolve(c)
              }
            })
          }
        })
  })
}
/*
  手机号验证
 */
function testPhone(phone) {
  var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
  return reg.test(phone)
}
/*
  邮箱验证
 */
function testEmail(email) {
  var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
  return reg.test(email)
}
module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  Login: Login,
  server: server,
  getMyData: getMyData,
  getMyPeers: getMyPeers,
  searchByParam: searchByParam,
  searchInGroup: searchInGroup,
  getCardsById: getCardsById,
  saveOrUpdate: saveOrUpdate,
  getUserGroupById: getUserGroupById,
  getGroupCards: getGroupCards,
  testPhone: testPhone,
  testEmail: testEmail,
  checkSave: checkSave,
  sharePage: sharePage,
  shareToQunOrPersonal: shareToQunOrPersonal
}