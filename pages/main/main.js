var app = getApp()
//var common = require("../../utils/common.js")
// var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
var _this = this;
// pages/main/main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    userName: "loading...",
    userImg: "",
    answerHint: "",
    theMounth: "",
    markedWords: "",
    canIUse: '',
    aNumber: 0
  },
  onLoad: function() {
    wx.clearStorage()
    try {
      //地址
      // wx.setStorageSync('biblequiz_mainurl', 'http://10.18.11.125:8085/') //解士文
      wx.setStorageSync('biblequiz_mainurl', 'http://www.jinshiyiran.com/') //正式
      wx.setStorageSync('biblequiz_login', 'passport/weixinLogin') //登录
      wx.setStorageSync('biblequiz_getRandQuestions', 'questions/getRandQuestions') //查询题库 随机10
    } catch (e) {}
    
    _this = this
    // 查看是否授权 
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            canIUse: "1"
          })
          _this.registerOrLoginUser();
        } else {
          console.log("没有授权，需要用户手动去点击")
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    //用户点击了拒绝
    if (e.detail.userInfo == null) {
      wx.showToast({
        title: '拒绝用户权限后不能正常使用程序哦',
        icon: 'none',
        duration: 2000
      })
    } else { //用户点了同意
      _this.setData({
        canIUse: "1"
      })
      _this.registerOrLoginUser();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


    // 
    // var currentUser = Bmob.User.current();
    // _this.setUserForUI(currentUser)
    // _this.getCurrentVInfo()

    // _this.updateSmallApp()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  //注册登录
  /**
   * usType:0:注册  1:登录
   */
  registerOrLoginUser: function() {
    _this.formatTime(); //更新当前时间

    wx.showLoading({
      title: '初始化',
    })

    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country

        var loginUrl;
        try {
          loginUrl = wx.getStorageSync('biblequiz_mainurl') + wx.getStorageSync('biblequiz_login')
        } catch (e) {}

        wx.login({
          success(res) {
            if (res.code) {

              console.log("res.code=" + res.code)
              // return;

              wx.request({
                url: loginUrl, //仅为示例，并非真实的接口地址
                method: 'POST',
                dataType: 'json',
                data: {
                  appid: "wx116bb648d30156d2",
                  secret: "81507aae7ddf0002ef94fe43052ee33a",
                  js_code: res.code,
                  grant_type: "authorization_code",
                  nickname: nickName,
                  avatar: avatarUrl,
                  gender: gender,
                  province: province,
                  city: city,
                  country: country
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success(res) {
                  wx.hideLoading()
                  console.log(res.data.status)
                  if (res.data.status == 200) {
                    console.log(JSON.stringify(res.data));
                    wx.setStorage({
                      key: "bq_jsessionid",
                      data: res.data.data.JSESSIONID
                    })
                    _this.setData({
                      score: res.data.data.weixinMarkScore,
                      aNumber: res.data.data.a_number,
                      userName: nickName,
                      userImg: avatarUrl
                    });
                    wx.setStorage({
                      key: "name",
                      data: nickName
                    })
                    wx.setStorage({
                      key: "icon",
                      data: avatarUrl
                    })

                    wx.setStorage({
                      key: "score",
                      data: res.data.data.weixinMarkScore + ""
                    })
                    wx.setStorage({
                      key: "objid",
                      data: res.data.data.id
                    })

                  } else {
                    wx.showModal({
                      title: '提示',
                      content: res.data.message,
                      showCancel: false,
                      success(res) {

                      }
                    })
                  }

               

                },
                fail(e) {
                  console.log('fail:' + res.errMsg)
                  wx.hideLoading()
                }
              })
            } else {
              wx.hideLoading()
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })

  },


  //开始答题按钮
  goAsk: function() {
    let tag = _this.data.canIUse
    if (tag) {
      wx.navigateTo({
        url: '../ask/ask'
      })
    } else {
      wx.showToast({
        title: '点👇他一下呗',
        icon: 'none',
        image: '../../images/icon_person_women.png',
        duration: 2000
      })
    }

  },
  //排行
  aboutWe: function() {
    let tag = _this.data.canIUse
    if (tag) {
      wx.navigateTo({
        url: '../ranklist/ranklist'
      })
    } else {
      wx.showToast({
        title: '咱就点👇他一下~',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //关于
  moreContent: function() {
    wx.navigateTo({
      url: '../aboutwe/aboutwe'
    })
  },

  formatTime: function() {

    // 调用函数时，传入new Date()参数，返回值是日期和时间    
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      theMounth: time
    })
  },
  getCurrentVInfo: function() {
    let that = this
    var Diary = Bmob.Object.extend("Scriptures");
    var query = new Bmob.Query(Diary);
    query.first({
      success: function(object) {
        // 查询成功

        that.setData({
          answerHint: object.get('s_hint'),
          markedWords: object.get('sNotice')
        })
        wx.setStorage({
          key: "ask_type",
          data: object.get('ask_type')
        })
      },
      error: function(error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },

})