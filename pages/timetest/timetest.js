//index.js

Page({
  data: {
    time: 60,         //初始时间
    interval: "",      //定时器
    lastNum:0
  },

  /**
    * 开始倒计时
   */
  startTap: function () {
    var that = this;
    that.init(that);          //这步很重要，没有这步，重复点击会出现多个定时器
    var time = 60;
    console.log("倒计时开始")
    var interval = setInterval(function () {
      time--;
      that.setData({
        time: time
      })
      if (time == 0) {           //归0时回到60
        that.restartTap();
        
      }
    }, 100)

    that.setData({
      interval: interval
    })
  },
  continueTap: function(){
    var that = this;
    that.init(that);          //这步很重要，没有这步，重复点击会出现多个定时器

    console.log("倒计时继续")
    var interval = setInterval(function () {
      time--;
      that.setData({
        time: time
      })
      if (time == 0) {           //归0时回到60
        that.restartTap();

      }
    }, 1000)

    that.setData({
      interval: interval
    })
  },
  /**
    * 暂停倒计时
   */
  stopTap: function () {
    var that = this;
    console.log("倒计时暂停" + that.data.time)
    that.setData({
      lastNum: that.data.time
    })
    that.clearTimeInterval(that)
  },

  /**
    * 重新倒计时
   */
  restartTap: function () {
    var that = this;
    //that.init(that);
    console.log("倒计时重新开始")
    if (that.data.lastNum != 0){


      var that = this;
      that.init(that);          //这步很重要，没有这步，重复点击会出现多个定时器
      var time = that.data.lastNum;
      console.log("倒计时开始" + that.data.lastNum)
      var interval = setInterval(function () {
        time--;
        that.setData({
          time: time
        })
       
      }, 1000)

      that.setData({
        interval: interval
      })

    }else{
      that.startTap();
    }

    
  },

  /**
    * 初始化数据
   */
  init: function (that) {
    var time = 60;
    var interval = ""
    that.clearTimeInterval(that)
    that.setData({
      time: time,
      interval: interval,
    })
  },

  /**
    * 清除interval
   * @param that
   */
  clearTimeInterval: function (that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },

  /**
    * 生命周期函数--监听页面卸载
    * 退出本页面时停止计时器
   */
  onUnload: function () {
    var that = this;
    that.clearTimeInterval(that)
  },

  /**
    * 生命周期函数--监听页面隐藏
    * 在后台运行时停止计时器
   */
  onHide: function () {
    var that = this;
    that.clearTimeInterval(that)
  },
 onShow: function(){
 }
})