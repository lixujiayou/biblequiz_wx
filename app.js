//app.js
var Bmob = require("utils/bmob.js");
var common = require("utils/common.js");
Bmob.initialize("21bfb1f1037b3963aaa2fe01bee1bc68", "2ad5eef1e9db172e8448216b0f16a5b8");
// Bmob.initialize("2ad5eef1e9db172e8448216b0f16a5b8", "21bfb1f1037b3963aaa2fe01bee1bc68");
App({
  onLaunch: function () {
   // this.getCurrentUserInfo();
  },
  onShow: function () {
    console.log("从猴套进来啦");
  },
  onHide: function () {
    console.log("出去了");
  },
  anyfunction: function () {
    console.log("任何的any方法");
  },
  globalData: {
    userInfo: null
  },
  //登录与注册
  getCurrentUserInfo: function () {
    var user = new Bmob.User();//实例化
    wx.login({

      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          console.log(user, 'user', user.id, res);
          if (user.get("nickName")) {

            // 第二次登录，打印用户之前保存的昵称
            console.log(user.get("nickName"), 'res.get("nickName")');

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
  }

})