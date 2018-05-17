

var app = getApp()
var common = require("../../utils/common.js")
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');  
var _this = this;
// pages/main/main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    userName:"loading...",
    userImg:"",
    answerHint:"本月答题:「士师记」",
    theMounth:""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _this = this;
    this.getCurrentUserInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
   //var user = new Bmob.User();//实例化
   // console.log("user=" + user.get("nickName"));
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //登录与注册
  getCurrentUserInfo: function () {
    _this.formatTime();
    var user = new Bmob.User();//实例化
    wx.login({

      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          console.log(user, 'user', user.id, res);
          if (user.get("nickName")) { 
            _this.setUserForUI(user)
            // 第二次登录，打印用户之前保存的昵称
           
           

            //更新openid
            wx.setStorageSync('openid', openid)
          } else {//注册成功的情况

            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u);
            query.get(user.id, {
              success: function (result) {
                wx.setStorageSync('own', result.get("uid"));
                console.log("登录成功"); 
              },
              error: function (result, error) {
                console.log("查询失败");
              }
            });


            //保存用户其他信息，比如昵称头像之类的
            wx.getUserInfo({
              success: function (result) {

                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;

                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                query.get(user.id, {
                  success: function (result) {
                    // 自动绑定之前的账号

                    result.set('nickName', nickName);
                    result.set("userPic", avatarUrl);
                    result.set("openid", openid);
                    result.save();

                  }
                });

              }
            });


          }

        }, function (err) {
          console.log(err, 'errr');
        });

      }
    });
  },
  setUserForUI: function (cUser) {
    console.log(cUser.get("nickName"), 'cUser.get("nickName")');
    console.log(cUser.get("openid"), 'cUser.get("nickName")');

    wx.setStorage({
      key: "name",
      data: cUser.get("nickName")
    })

    wx.setStorage({
      key: "icon",
      data: cUser.get("userPic") 
    })

    wx.getStorage({
      key: 'name',
      success: function (res) {
        var mmres = res.data;
        if (res.data.length > 10){
          mmres = res.data.substring(0,10);
        }
        _this.setData({
          userName: mmres
        });
      }
    })
    wx.getStorage({
      key: 'icon',
      success: function (res) {
        _this.setData({
          userImg: res.data
        });
      }
    })

    var Diary = Bmob.Object.extend("User");
    var query = new Bmob.Query(Diary);
    query.equalTo("openid", cUser.get("openid"));
    // 查询所有数据
    query.first({
      success: function (object) {
      // console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
      
        console.log(object.id + "得分=" + object.get('mscore'));
      
          wx.setStorage({
            key: "score",
            data: object.get('mscore')
          })

          wx.getStorage({
            key: 'score',
            success: function (res) {
              _this.setData({
                score: res.data
              });
            }
          })

       

       

      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });





  },
  //开始答题按钮
  goAsk:function(){
    wx.navigateTo({
      url: '../ask/ask'
    })
  },
  //关于我们按钮
  aboutWe:function(){
    wx.navigateTo({
      url: '../aboutwe/aboutwe'
    })
  },
  //更多精彩按钮
  moreContent:function(){
      wx.showToast({
        title: '程序猿偷懒啦...',
        icon:'success',
        duration:2000
      })
  },


  formatTime:function() {  
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
      this.setData({
        theMounth: time
      })
  } 
      
  

})