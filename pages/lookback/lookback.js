// pages/lookback/look back.js


var thisQustions = new Array;//本次的答题
var myChoose = new Array;//记录我的选择
var that;
var currentIndex = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    thisQustions: '',
    myChoose: '',
    answer_color: '',
    rightChooseColor: '',
    currentPage: 1,
    leftIsShow: "",
    rightIsShow: "",
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    let tempList = JSON.parse(options.alist);
    myChoose = JSON.parse(options.clist);

    for (var i = 0; i < myChoose.length; i++) {
      thisQustions[i] = tempList[i]
    }
    if (thisQustions.length > 1) {
      that.setData({
        rightIsShow: '1'
      })
    }
currentIndex
    console.log(options.clist + "=====" + options.alist)
    that.setData({
      thisQustions: thisQustions,
      myChoose: myChoose
    })

  },
  listenSwiper: function (e) {
    //打印信息
    // console.log(e.detail.current)
    that.setData({
      currentPage: e.detail.current + 1
    })

    let cpage = e.detail.current
    currentIndex = cpage;
    if (cpage == 0) {
      that.setData({
        leftIsShow: ''
      })
    } else {
      that.setData({
        leftIsShow: '1'
      })
    }
    if (cpage == thisQustions.length - 1) {
      that.setData({
        rightIsShow: ''
      })
    } else {
      that.setData({
        rightIsShow: '1'
      })
    }
  },
  lefttap: function(){ 
    currentIndex--
    that.setData({
      currentIndex: currentIndex
    })
  },
  righttap: function(){
    currentIndex++
    that.setData({
      currentIndex: currentIndex
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '本局回顾'
    })
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
    that.setData({
      thisQustions: "",
      myChoose: "",
      rightIsShow: "",
      leftIsShow: ""
    })
    thisQustions = ""
    thisQustions = new Array;//本次的答题
    myChoose = ""
    myChoose = new Array;//记录我的选择
  },



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
})