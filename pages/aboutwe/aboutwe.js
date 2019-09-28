// pages/aboutwe/aboutwe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "\n&nbsp;&nbsp;&nbsp;&nbsp;圣经问答于2016年2月上线Android(安卓)版，2017年11月上线IOS(苹果)版，目前累计7万+下载量，当前为小程序Lite版，于2018年6月份上线；",
    content_rule:"\n&nbsp;&nbsp;&nbsp;&nbsp;为避免小答被打，还是讲讲规则啦",
    content_other: "\n&nbsp;&nbsp;&nbsp;&nbsp;已定版接下来的研发计划，预计一年的研发时间，看来有必要让小答辞个职专心做这件事啦，非常精彩，敬请期待一年后的圣经问答~"

  },
  copyWX: function(){
    wx.setClipboardData({
      data: 'LYJONE1',
      success: function (res) {
      }
    })
  },
  copyWB: function () {
    wx.setClipboardData({
      data: 'hi小答',
      success: function (res) {
      }
    })
  },
  copyQQ: function () {
    wx.setClipboardData({
      data: '599878311',
      success: function (res) {
      }
    })
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
})