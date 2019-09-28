
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var _this = this;


// pages/ranklist/ranklist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranklist:'',
    scroHeight:330,
    isMe:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _this.getSys()
    _this.getRankList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
 
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '今天的读经U记住了吗？',
      path: '/pages/main/main'
    }
  },
  
  loadingTap: function () {
    wx.showToast({
      title: "",
      icon: "loading",
      duration: 5000
    })
  },
  getRankList: function () {

    wx.getStorage({
      key: 'objid',
      success: function (res) {

    _this.loadingTap();
    var user = Bmob.Object.extend("_User");
    var query = new Bmob.Query(user);
    query.descending("mscore");//以分数为降序
    query.ascending('a_number');//以答题次数为升序
    query.greaterThan("mscore", 0);//大于0分
    query.limit(20);
    // 查询所有数据
    query.find({ 
      success: function (results) {
        wx.hideToast()
        _this.setData({ 
          ranklist: results 
        })
        console.log("共查询到 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          
          if (object.id == res.data){
        
            _this.setData({ 
              isMe:i+1
            })
          }
        }
      },
      error: function (error) {
        wx.hideToast()
        wx.showToast({
          title: "抱歉，系统错误，请重试(" + error.code + " " + error.message + ")",
          icon: "none",
        })
        wx.navigateBack({
          delta: 1
        })
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

      }
    })



  },
  getSys: function(){
    wx.getSystemInfo({ 
      success: function (res) {

        if (res.windowHeight > 700 && res.screenHeight > 800){
          _this.setData({
            scroHeight: res.windowHeight / 5.5 * 3 + res.statusBarHeight
          })
        }else{
        _this.setData({ 
          scroHeight: res.windowHeight / 5.5 * 3
          })
      }

      }
    })

  }

})