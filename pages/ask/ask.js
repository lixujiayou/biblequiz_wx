
const util = require('../../utils/util.js')
var Bmob = require("../../utils/bmob.js");
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


//获取应用实例
const app = getApp();
var _this = this;
var allQustions = new Array;//所有的答题
var thisQustions = new Array;//本次的答题
var answerNum = 10;//每次答题个数
var thisIndex = 0;//当前题目下标
var disorganizeAnswers = new Array;//本次答题的答案，乱序
var countdownNum = 20;//倒计时
var lastCountNum = 0;//记录关闭倒计时时的最后num
var currentCountdownNum = 0;//当前倒计时到第几

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({
  data: {
    thisTitle: '',//当前题目
    thisAnswer: '',//当前题目的答案
    progress_txt: '正在匹配中...',
    countdown: countdownNum,//倒计时

    answerNo: answerNum,
    thisIndex: thisIndex,//第几道题
    continuousYes: 0,//连续答对个数
    interval: "", //定时器
    proScoreInterval: "",//得分进度条定时器
    lastNum: 0,
    time: countdownNum, //初始时间

    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    local_click: false,//是否本地单击的答案

    click_index: '',//判断用户选择了哪个答案
    answer_color: '',//根据选择正确与否给选项添加背景颜色
    score_myself: 0,//自己的总分
    score_myself_progress: 0,//自己的总分  用于进度条

    game_over: false,  //判断此次PK是否结束
    win: false,  //判断当前用户是否胜利
    sendNumber: 0//每一轮的答题次数不能超过1次
  },
  onLoad: function (options) {
    this.setData({
      userInfo_icon: wx.getStorageSync('icon'),
    })

    this.fighting_ready()//查询数据
  },

  onReady: function () {
    _this = this;
    //创建并返回绘图上下文context对象。 
    // 页面渲染完成  
    this.drawProgressbg();


  },
  loadingTap: function () {
    wx.showToast({
      title: "",
      icon: "loading",
      duration: 15000
    })
  },
  fighting_ready() {
    let that = this;
    that.loadingTap();
    var Diary = Bmob.Object.extend("questionBank");
    var query = new Bmob.Query(Diary);
    // 查询所有数据
    query.find({
      success: function (results) {
        wx.hideToast()
        console.log("共查询到 " + results.length + " 条记录");

        allQustions = results;
        that.startAnimate();//定义开始动画


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
  },
  restAnswer: function () {
    this.data.count = 0;
    //获取新题目后,倒计时归为10，将click_index清空，ha_click改为未选择.
    this.setData({
      countdown: countdownNum,
      local_click: false,

      click_index: '',
      answer_color: '',
      sendNumber: 0
    })
    clearInterval(this.countTimer);
    var that = this;
    that.init(that);
    //this.countInterval();
    this.startTap();
    console.log("重新开始");
  },
  initQuestionBank: function (qb) {
    var num;
    var arrayTest = new Array;//此数组作为一个基点
    //清空数组
    if (thisQustions != null) {
      thisQustions.splice(0, thisQustions.length);
    } else {
      thisQustions = new Array;
    }


    if (qb != null && qb.length != 0) {
      //为测试数组填充与真实数据一样的数据个数
      for (var i = 0; i < qb.length; i++) {
        arrayTest[i] = i + 1;
      }

      for (var i = 0; i < qb.length; i++) {
        var object = qb[i];
        do {
          num = parseInt(Math.random() * qb.length);
        } while (arrayTest[num] == null);
        arrayTest[num] = null;
        //循环出唯一的随机数


        thisQustions[i] = qb[num];
        console.log("qqqqqqqqq==" + thisQustions[i].get('answers'));
        //已循环足够的答题个数
        if (thisQustions.length >= answerNum) {

          break;
        }
      }
      _this.initThisAnswer();
    }
  },
  initThisAnswer: function () {//初始化当前题目
    if (thisQustions == null) {
      return;
    }
    _this.restAnswer();
    // if (thisAnswer == null) {
    //   thisAnswer = new Array;
    // } else {
    //   thisAnswer.splice(0, ary.length);
    // }
    //将答案打乱 

    var currentAnswers = thisQustions[thisIndex].get('answers');
    var answersTest = new Array;

    for (var i = 0; i < currentAnswers.length; i++) {
      answersTest[i] = i + 1;
    }

    var num;
    for (var i = 0; i < currentAnswers.length; i++) {
      do {
        num = parseInt(Math.random() * currentAnswers.length)
      } while (answersTest[num] == null);
      answersTest[num] = null;
      //打乱的答案

      disorganizeAnswers[i] = currentAnswers[num];
    }
    console.log("=====");

    this.setData({
      thisTitle: thisQustions[thisIndex].get('topic'),
      thisAnswer: disorganizeAnswers
    })
  },



  answer(e) {//开始答题
    const that = this

    if (this.data.time <= 10) {
      this.pauseBgm();
    }
    this.stopTap();

   

    that.startOtherBgm('tap')
    if (!that.data.local_click) {  //防止重新选择答案
      var mS = disorganizeAnswers[e.currentTarget.dataset.index];//我的选择
      var successAsk = thisQustions[thisIndex].get('answers')[0];//正确选项
      if (mS == successAsk) {//判断答案是否正确
        that.data.continuousYes++

        //that.startOtherBgm('y2')
        //此处有播放音频bug  先关掉
        if (true) {
          switch (that.data.continuousYes) {
            case 1:
              that.startOtherBgm('y1')
              break
            case 2:
              that.startOtherBgm('y1')
              break
            case 3:
              that.startOtherBgm('y1')
              break
            case 4:
              that.startOtherBgm('y1')
              break
            default:
              that.startOtherBgm('y')
              break
          }
        } else {
          switch (that.data.continuousYes) {
            case 1:
              that.startOtherBgm('y1')
              break
            case 2:
              that.startOtherBgm('y2')
              break
            case 3:
              that.startOtherBgm('y3')
              break
            case 4:
              that.startOtherBgm('y4')
              break
            default:
              that.startOtherBgm('y')
              break
          }
        }


        //设置按钮为正确颜色
        that.setData({
          click_index: e.currentTarget.dataset.index,
          answer_color: 'right'
        })
        //答对了则加分，时间越少加分越多,总分累加
        that.countScore()



        setTimeout(function () {
          if (thisIndex == thisQustions.length) {
            that.gameOverContext.play()
            that.setData({
              game_over: true,
              win: true
            })
          } else {
            _this.initThisAnswer();
          }
        }, 1500)

      } else {


        that.setData({
          click_index: e.currentTarget.dataset.index,
          answer_color: 'error',
          continuousYes: 0
        })

        // for (var i = 0; i < disorganizeAnswers.length;i++ ){
        //   if (disorganizeAnswers[i] == successAsk){
        //     that.setData({
        //       click_index: i,
        //       answer_color: 'right'
        //     })
        //   }
        // }

        that.startOtherBgm('erro')
        that.setData({
          score_myself: 0
        })

        setTimeout(function () {
          that.gameOverContext.play()
          that.pauseBgm(); 
          that.stopTap(); 
          that.setData({
            game_over: true,
            win: true
          })
        }, 1500)
      }
     // that.progressAnime() 
    
      thisIndex += 1
      that.setData({
        thisIndex: thisIndex
      })
    }
    that.clearTimeInterval(that);

  },
  /**
   * 计算得分
   */
  countScore: function () {
    let that = this;
    let theScore;

    console.log("==" + that.data.time);

    if (that.data.time >= 16) {
      theScore = 10
    } else if (that.data.time >= 13) {
      theScore = 8
    } else if (that.data.time >= 7) {
      theScore = 6
    } else {
      theScore = 4
    }
    theScore += that.data.score_myself
    that.setData({
      score_myself: theScore
    })
    console.log("得分" + theScore);
  },
  continue_fighting() {
    wx.navigateBack({
      delta: 1
    })
  },
  startAnimate: function () {
    const that = this
    that.setData({
      zoomIn: 'zoomIn'
    })
    setTimeout(function () {
      _this.initQuestionBank(allQustions);
      that.setData({
        zoomOut: 'zoomOut'
      })
    }, 1500)
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(3);// 设置圆环的宽度
    ctx.setStrokeStyle('#AAD0FF'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(45, 45, 35, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);

    gradient.addColorStop("0", "#22FF1E");
    gradient.addColorStop("0.6", "#DDE83D");
    gradient.addColorStop("1.0", "#F00011");

    context.setLineWidth(4);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(45, 45, 35, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  // countInterval: function () {
  //   let countdown = countdownNum;
  //   let convertUnitTemp = 0;
  //   var that = this;
  //   that.init(that);  
  //   var time = that.data.time;
  //   this.countTimer = setInterval(() => {

  //     if (this.data.count <= 200) {
  //       this.drawCircle(this.data.count / (200 / 2))
  //       convertUnitTemp++;

  //       if (convertUnitTemp == 10) {
  //         console.log("countdown=" + countdown);
  //         countdown--
  //         currentCountdownNum = countdown;//记录当前
  //         _this.setData({
  //           countdown
  //         })
  //         convertUnitTemp = 0;
  //       }
  //       this.data.count++;
  //     } else {
  //       clearInterval(this.countTimer);
  //     }
  //   }, 100)
  // },
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
    console.log("记住倒计时" + that.data.time);
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

  // progressAnime: function () {
  //   let that = this
  //   let interval = ""

  //   that.setData({
  //     proScoreInterval: interval
  //   })
  //   var interval2 = that.data.proScoreInterval;
  //   that.clearTimeInterval(interval2)

  //   let lastScore = that.data.score_myself_progress
  //   let theScore = that.data.score_myself - lastScore

  //   var pp = setInterval(function () {
   
      
  //     if (lastScore >= theScore) {
  //       console.log("销毁了")

  //       var interval = that.data.proScoreInterval;
  //       that.clearTimeInterval(interval);
       
  //       that.setData({
  //         proScoreInterval: "",
  //         score_myself_progress: that.data.score_myself
  //       })

  //       return
  //     }

  //     lastScore++
  //     that.setData({
  //       score_myself_progress: lastScore
  //     })

  //   }, 100)

  //   that.setData({
  //     score_myself_progress: pp
  //   })
  // },
  /**
 * isRe:是否重新计时
 */
  goCountNum: function (isRe) {
    let convertUnitTemp = 0;
    var that = this;
    that.init(that);  //这步很重要，没有这步，重复点击会出现多个定时器

    var time = countdownNum;
    if (that.data.lastNum != null && that.data.lastNum != 0 && !isRe) {
      time = that.data.lastNum;
      console.log("重新倒计时==" + time);
      time--
    }


    var interval = setInterval(function () {
      _this.drawCircle(2 - _this.data.count / (countdownNum * 10 / 2))

      if (convertUnitTemp == 10) {
        time--;
        _this.setData({
          countdown: time
        })
        _this.setData({
          time: time
        })
        convertUnitTemp = 0;

      }
      convertUnitTemp++;

      if (time == 0) {
        that.clearTimeInterval(that);
        that.setData({
          game_over: true,
          win: true
        })
        that.startOtherBgm('erro')
        that.gameOverContext.play()
      } else if (time == 10) {
        if (that.timeLittleContext != null) {
          that.pauseBgm()
          that.timeLittleContext.play()
        }
      }
      _this.data.count++;
    }, 100)

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
      interval: interval
    })
  },
  onShareAppMessage: function (res) {
    const that = this;
    return {
      title: '扎根于圣经,建基于祷告.',
      path: '/pages/entry/entry?currentClickId=' + app.appData.currentClickId,
      success: function (res) {
        //转发时向用户关系表中更新一条转发记录(个人为person，群为GId)。
        require('../../utils/upDateShareInfoToUser_network.js').upDateShareInfoToUser_network(app, that, res)
        wx.redirectTo({
          url: '../entry/entry'
        })
      }
    }
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
    if (that.timeLittleContext != null) {
      that.timeLittleContext.stop()
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
   * tap:点击
   * erro:错误
   * y:选择正确
   */
  startOtherBgm: function (playType) {
    if (playType == null || playType.length < 1 && that.askContext != null) {
      return;
    }
    var that = this;
    if (playType == "tap") {
      that.askContext.src = clickPath
    } else if (playType == "erro") {
      that.askContext.src = askErroPath
    } else if (playType == "y1") {
      that.askContext.src = yes1Path
    } else if (playType == "y2") {
      that.askContext.src = yes2Path
    } else if (playType == "y3") {
      that.askContext.src = yes3Path
    } else if (playType == "y4") {
      that.askContext.src = yes4Path
    } else if (playType == "y") {
      that.askContext.src = yesNPath
    }
    that.askContext.play()

  },

  /**
    * 生命周期函数--监听页面卸载
    * 退出本页面时停止计时器
   */
  onUnload: function () {
    var that = this;
    //  clearInterval(this.countTimer);
    that.clearTimeInterval(that);
    that.closeBgm();

  }
})