// pages/lookback/look back.js


var thisQustions = new Array;//本次的答题
var myChoose = new Array;//记录我的选择
var that;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    thisQustions: '',
    myChoose:'',
    answer_color: '',
    rightChooseColor:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    thisQustions =  JSON.parse(options.alist);
    myChoose = JSON.parse(options.clist);
    console.log(options.clist + "=====" + options.alist)
    that.setData({
      thisQustions: thisQustions,
      myChoose: myChoose
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
  
  }
})