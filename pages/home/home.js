// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    button_name: '授权',
    warning_switch: false,
    warning_content: "未授权登录，请进行授权",
    auth_img_src: 'https://www.baidu.com/img/baidu_jgylogo3.gif',
    inputSecureCode: null,
    inputAuth: null,
    authFocus: false,
    auth_img_code: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * TODO
     * 1.要求登录，获取用户信息备用
     * 2.请求是否为验证用户
     * 2.1 已验证用户提示已经验证并跳至下一页面 ==> over
     * 2.2 未验证用户提示要求验证
     * 3.获取、刷新验证码图 ==> 异步操作
     * 4.提交表单
     */
    var that = this;
    wx.login({
      success: function (res) {
        console.log("Login Success");
        console.log(res);
        that.getOpenID(res.code);
        // if (!(app.globalData.userInfo)) that.getWxInfo();
      }
    });
  },

  /**
   * 自定义的各个绑定函数（和页面元素绑定
   */
  SecureCodeInput: function (e) {
    // 处理输入
    this.setData({ inputSecureCode: e.detail.value });
  },

  AuthCodeInput: function (e) {
    // 处理输入
    this.setData({ inputAuth: e.detail.value });
  },

  nextClick: function () {
    // 安全码输入框键盘的完成按钮点击事件
    this.setData({ authFocus: true });
  },

  register: function () {
    // TODO 进行注册
    console.log(this.data);
    this.setData({ warning_switch: false });
    if (!this.data.inputSecureCode || this.data.inputSecureCode == '') {
      this.setData({ warning_content: "请输入安全码", warning_switch: true });
    } else if (!this.data.inputAuth || this.data.inputAuth == '') {
      this.setData({ warning_content: "请输入验证码", warning_switch: true });
    } else {
      // TODO 向我们的服务器发送请求 wx.request
    }
  },

  renewAuthimg: function () {
    // 获取验证码图片
    var that = this;
    wx.request({
      url: '',
      success: function (res) {
        that.setData({
          auth_img_src: res.src
        });
      }
    })
  },

  /**
   * 功能函数，供后台调用
   */

  getOpenID: function (code) {
    // 获取OpenID和SessionID的函数
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      method: 'GET',
      data: {
        'appid': app.globalData.appID,
        'secret': app.globalData.appSecure,
        'js_code': code,
        'grant_type': 'authorization_code'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.openID = res.data.openid;
        app.globalData.session_key = res.data.session_key;
        console.log("Got data");
        console.log(res.data)
      }
    })
  },

  getWxInfo: function () {
    // 获取头像和昵称
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo = res.userInfo;
      },
      fail: function () {
        wx.showToast({
          title: '您可以在登录后设置重新获取',
          icon: 'none',
          duration: 2000
        })
      }

    })
  },

  getHCInfo: function (openID, secureCode) {
    // 获取潮友信息
    // TODO 暂时用其他API代替这一块
  },

  /************************下面的我不关心，是自带的************************/

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