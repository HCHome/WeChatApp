// pages/home/home.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    button_name: '登录',
    button_show: true,
    warning_switch: false,
    warning_content: "warning",
    auth_img_src: 'https://www.baidu.com/img/baidu_jgylogo3.gif',
    inputSecureCode: null,
    inputAuth: null,
    show_input: false,
    authFocus: false,
    auth_img_code: null,
    emmCode: null,
    wxlogin_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wx_login();
  },

  /**
   * 自定义的各个绑定函数（和页面元素绑定）
   */
  // 处理输入
  SecureCodeInput: function (e) { this.setData({ inputSecureCode: e.detail.value }); },
  AuthCodeInput: function (e) { this.setData({ inputAuth: e.detail.value }); },

  // 安全码输入框键盘的完成按钮点击事件
  nextClick: function () { this.setData({ authFocus: true }); },

  buttonClick: function () {
    if (this.data.button_name == '认证')
      this.hc_register();
    else if (this.data.button_name == '重新登录')
      this.hc_login();
    else if (this.data.button_name == '重试')
      this.wx_login();
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

  wx_login: function () {
    // 使用微信号登录小程序
    // 超过三次登录态过期则失败
    if (this.data.wxlogin_count >= 3) {
      this.warning('wx_fail');
    } else {
      this.setData({ wxlogin_count: this.data.wxlogin_count + 1 });
      var that = this;
      wx.login({
        // 登录成功则进行HC的登录
        success: function (res) {
          console.log("Login Success");
          app.globalData.js_code = res.code;
          that.hc_login();
        },
        fail: function (res) { that.warning('hc_fail'); }
      });
    }
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

  hc_login: function () {
    // 登录HC，获取潮友信息
    var that = this;
    if (app.globalData.js_code) {
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.request({
        url: app.globalData.url_hc + '/user/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          jsCode: app.globalData.js_code
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.status == '10001') {
            // TODO 处理潮友信息，进入首页
            console.log("hc login success");
          } else if (res.data.status == '10002') {
            // 发生异常
            that.warning('hc_fail');
          } else if (res.data.status == '10003') {
            // 未认证潮友，进行注册流程
            that.warning('hc_no_found');
          } else if (res.data.status == '10004') {
            // 登录态超时，尝试重登
            that.wx_login();
          }
        },
        fail: function (res) {
          that.warning('hc_fail');
        }
      });
    }
    else
      that.wx_login();
  },

  hc_register: function () {
    // 向hc服务器发起注册请求
    console.log(this.data);
    this.setData({ warning_switch: false });
    // 检测输入框
    if (!this.data.inputSecureCode || this.data.inputSecureCode == '') {
      this.setData({ warning_content: "请输入安全码", warning_switch: true });
    } else if (!this.data.inputAuth || this.data.inputAuth == '') {
      this.setData({ warning_content: "请输入验证码", warning_switch: true });
    } else {
      // TODO 注册
      console.log('TODO 注册')
    }
  },

  // warning的集成
  warning: function (warningType) {
    wx.hideLoading();
    // 微信登录超过3次失败
    if (warningType == "wx_fail") {
      this.setData({
        button_show: true,
        button_name: '重试',
        show_input: false,
        warning_switch: true,
        warning_content: "登录失败！"
      });
    }
    // 未认证潮友 
    else if (warningType == "hc_no_found") {
      this.setData({
        button_show: true,
        button_name: "认证",
        show_input: true,
        warning_switch: true,
        warning_content: "未认证潮友，请认证"
      });
    }
    // 连接HC服务器异常
    else if (warningType == "hc_fail") {
      this.setData({
        button_show: true,
        button_name: '重新登录',
        show_input: false,
        warning_switch: true,
        warning_content: "服务器发生异常，请重试"
      });
    }
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