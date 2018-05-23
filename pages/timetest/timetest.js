//index.js
var countdownNum = 20;//倒计时

/**
 * 音频相关
 */
var innerAudioContext;
var timeLittleContext;
var readyContext;
var askContext;
var gameOverContext;
var clickContext;

var mainBgmPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/021776c640e818fb805286d722671273.mp3";
var timeLittlePath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/5516d59a40ed7d23805e17895c4e1759.mp3";
var readyPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/918ebffd40cb11ab808cab11101d0ee8.mp3";
var yesNPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/be1fb49c401ae8f68029441d29a1b17e.mp3";
var yes4Path = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/f8c61306401d4cac8034fc5f5f6b68cb.mp3";
var yes3Path = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/d3ec0980406f087b80bf4cb1f914d65c.mp3";
var yes2Path = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/a721416b40de5c79807d69f08518fe40.mp3";
var yes1Path = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/81edc704409779eb8019658412d7abd5.mp3";
var askErroPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/1638b805404eb28a80760134af0ea392.mp3";

var gameOverPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/9426c3d6407fafe78060c9a654c13d2c.mp3";
var clickPath = "http://bmob-cdn-9637.b0.upaiyun.com/2018/05/23/12654a5c40cc005d806698913c66ea93.mp3";


Page({
  data: {
    time: countdownNum, //初始时间
    interval: "", //定时器
    lastNum: 0
  },

  /**
    * 开始倒计时
   */
  startTap: function () {
 
    this.startBgm();
    this.goCountNum(true);
  },
  /**
    * 暂停倒计时
   */
  stopTap: function () {
    var that = this;
    that.setData({
      lastNum: that.data.time
    })
    that.clearTimeInterval(that)
  },
  /**
    * 继续倒计时
   */
  restartTap: function () {
    this.goCountNum(false);
  },
  /**
   * isRe:是否重新计时
   */
  goCountNum: function (isRe) {
    var that = this;
    that.init(that);          //这步很重要，没有这步，重复点击会出现多个定时器

    var time = countdownNum;
    if (that.data.lastNum != null && that.data.lastNum != 0 && !isRe) {
      time = that.data.lastNum;
      time --
    }

    var interval = setInterval(function () {
      that.setData({
        time: time
      })

      if (time == 0) {
        that.clearTimeInterval(that);
      } else if (time == 10) {
        if (that.timeLittleContext != null) {
          that.pauseBgm()
          that.timeLittleContext.play()
        }

      }
      time--;
    }, 1000)

    that.setData({
      interval: interval
    })
  },

  /**
    * 初始化数据
   */
  init: function (that) {
    var time = countdownNum;
    if (that.data.lastNum != null && that.data.lastNum != 0) {
      time = that.data.lastNum;
    }
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
  initBgm: function () {
    var that = this;
    console.log("初始化音频");
    that.innerAudioContext = wx.createInnerAudioContext()
    that.innerAudioContext.autoplay = false //是否自动播放
    that.innerAudioContext.loop = true //是否循环播放
    that.innerAudioContext.src = mainBgmPath
    that.innerAudioContext.onPlay(() => {
    })
    that.innerAudioContext.onError((res) => {
    })

    that.timeLittleContext = wx.createInnerAudioContext()
    that.timeLittleContext.autoplay = false //是否自动播放
    that.timeLittleContext.loop = false //是否循环播放
    that.timeLittleContext.src = timeLittlePath
    that.timeLittleContext.onPlay(() => {
    })
    that.timeLittleContext.onError((res) => {
    })

    that.timeLittleContext = wx.createInnerAudioContext()
    that.timeLittleContext.autoplay = false //是否自动播放
    that.timeLittleContext.loop = false //是否循环播放
    that.timeLittleContext.src = timeLittlePath
    that.timeLittleContext.onPlay(() => {
    })
    that.timeLittleContext.onError((res) => {
    })

    that.readyContext = wx.createInnerAudioContext()
    that.readyContext.autoplay = true //是否自动播放
    that.readyContext.loop = false //是否循环播放
    that.readyContext.src = readyPath
    that.readyContext.onPlay(() => {
    })
    that.readyContext.onError((res) => {
    })


    that.askContext = wx.createInnerAudioContext()
    that.askContext.autoplay = false //是否自动播放
    that.askContext.loop = false //是否循环播放
    that.askContext.src = yes1Path
    that.askContext.onPlay(() => {
    })
    that.askContext.onError((res) => {
    })


    that.gameOverContext = wx.createInnerAudioContext()
    that.gameOverContext.autoplay = false //是否自动播放
    that.gameOverContext.loop = false //是否循环播放
    that.gameOverContext.src = gameOverPath
    that.gameOverContext.onPlay(() => {
    })
    that.gameOverContext.onError((res) => {
    })


    that.clickContext = wx.createInnerAudioContext()
    that.clickContext.autoplay = false //是否自动播放
    that.clickContext.loop = false //是否循环播放
    that.clickContext.src = clickPath
    that.clickContext.onPlay(() => {
    })
    that.clickContext.onError((res) => {
    })
  },
  /**
   * 播放音频
   */
  startBgm: function () {
    var that = this;
    if (that.innerAudioContext == null) {
      that.initBgm();
    }
    that.innerAudioContext.play()
  },

  pauseBgm: function () {
    var that = this;
    if (that.innerAudioContext == null) {
      return;
    }
    if (that.timeLittleContext != null) {
      that.timeLittleContext.pause()
    }
    that.innerAudioContext.pause()
  },


  closeBgm: function () {
    var that = this;
    if (that.innerAudioContext != null) {
      that.innerAudioContext.stop()
      that.innerAudioContext.destroy()

      that.timeLittleContext.stop()
      that.timeLittleContext.destroy()

      that.readyContext.stop()
      that.readyContext.destroy()

      that.askContext.stop()
      that.askContext.destroy()

      that.gameOverContext.stop()
      that.gameOverContext.destroy()

      that.clickContext.stop()
      that.clickContext.destroy()
    }
  },

  /**
    * 生命周期函数--监听页面卸载
    * 退出本页面时停止计时器
   */
  onUnload: function () {
    var that = this;
    that.clearTimeInterval(that);
    that.closeBgm();
  },


  /**
    * 生命周期函数--监听页面隐藏
    * 在后台运行时停止计时器
   */
  onHide: function () {
    this.pauseBgm();
    this.stopTap();
  },
  onShow: function () {
    var that = this;
    if (that.innerAudioContext == null) {
      that.initBgm()
    } else {
      if (this.data.lastNum != null && this.data.lastNum != 0) {
        this.restartTap();
        if (this.data.lastNum <= 10) {
          that.timeLittleContext.play()
        } else {
          that.startBgm();
        }
      }
    }
  }
})