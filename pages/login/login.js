// pages/home/home.js

const app = getApp()
const loginManager = require('../../utils/loginManager.js')
const unitConvert = require('../../utils/unitConvert.js')
const authImg = require('./authImg.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        button_name: '登录',
        button_show: false,
        warning_switch: false,
        warning_content: "warning",
        show_input: false,
        authFocus: false
    },

    // 内部用变量，避开setData，避免卡顿
    _data: {
        inputSecureCode: null,
        inputAuth: null,
        auth_img_code: null,
        applying: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '登录中...', mask: true });
        // 进行登录
        var that = this;
        loginManager.login({
            success: res => {
                if (res.data.status) {
                    wx.hideLoading();
                    switch (res.data.status) {
                        case 10001:
                        wx.showToast({ title: '登录成功！', mask: true, duration: 1000 });
                        wx.switchTab({ url: '../home/home' });
                        break;
                        case 10002:
                        that.warning('hc_login_fail');
                        break;
                        case 10003:
                        that.warning('hc_no_found');
                        that.renewAuthimg();
                        break;
                        case 10004:
                        that.warning('hc_login_fail');
                        break;
                        case 10006:
                        that._data.applying = res.data.data;
                        this.warning('hc_applying');
                        break;
                    }
                }
            },
            fail: () => {
                wx.hideLoading();
                that.warning('hc_login_fail');
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 自定义的各个绑定函数（和页面元素绑定）
     */
    // 处理输入
    SecureCodeInput: function (e) { this._data.inputSecureCode = e.detail.value; },
    AuthCodeInput: function (e) { this._data.inputAuth = e.detail.value; },

    // 安全码输入框键盘的完成按钮点击事件
    nextClick: function () { this.setData({ authFocus: true }); },

    // 按钮
    buttonClick: function () {
        if (this.data.button_name == '认证')
            this.hc_register();
        else if (this.data.button_name == '重试')
            this.onShow();
        else if (this.data.button_name == '重新登录')
            this.onShow();
    },

    // 刷新验证码
    renewAuthimg: function () {
        // 设置验证码图片
        // 随机字符串
        this._data.auth_img_code = authImg.randStr();
        // 获取画布大小
        var width = unitConvert.rpx2px(120);
        var height = unitConvert.rpx2px(40);
        authImg.buildImg(this, this._data.auth_img_code, 'auth_img', width, height);
    },

    /**
     * 功能函数，供后台调用
     */

    hc_register: function () {
        // 向hc服务器发起注册请求
        this.setData({ warning_switch: false, button_show: false });
        // 检测输入框
        if (!this._data.inputSecureCode || this._data.inputSecureCode == '') {
            this.warning('no_secure_code');
        } else if (!this.testAuth()) {
            this.warning('no_auth_code');
        } else {
            var that = this;
            wx.showLoading({ title: '注册中...', mask: true });
            loginManager.hc_register({
                secureCode: that._data.inputSecureCode,
                success: res => {
                    wx.hideLoading();
                    if (res.data.status == 10001) {
                        // 注册成功，跳转页面
                        wx.switchTab({ url: '../home/home' });
                    } else if (res.data.status == 10002) {
                        // hc服务器异常
                        that.warning('hc_register_fail');
                    } else if (res.data.status == 10003) {
                        // 安全码错误
                        that.warning('secure_code_fail');
                        that.renewAuthimg();
                    } else if (res.data.status == 10004) {
                        // 登录态过期
                        that.warning('wx_fail');
                    }
                },
                fail: () => {
                    wx.hideLoading();
                    that.warning('hc_register_fail');
                    that.renewAuthimg();
                }
            });
        }
    },

    // 供注册的时候返回用
    setApply: function (applying) {
        this._data.applying = applying;
        //this.warning('hc_applying');
    },

    testAuth: function () {
        // 对验证码进行比对
        if (!this._data.inputAuth || this._data.inputAuth.length != 4)
            return false;
        else
            return this._data.inputAuth.toUpperCase() == this._data.auth_img_code.toUpperCase();
    },

    warning: function (warningType) {
        // warning的集成，修改警告信息并改变按钮和输入区可见性
        wx.hideLoading();
        // 未输入安全码
        if (warningType == 'no_secure_code')
            this.setData({
                warning_content: "请输入安全码",
                warning_switch: true
            });

        // 未输入验证码
        else if (warningType == 'no_auth_code')
            this.setData({
                warning_content: "请输入验证码",
                warning_switch: true
            });

        // 微信登录超过3次失败
        else if (warningType == "wx_fail")
            this.setData({
                button_show: true,
                button_name: '重新登录',
                show_input: false,
                warning_switch: true,
                warning_content: "微信登录失败！"
            });

        // 未认证潮友
        else if (warningType == "hc_no_found")
            this.setData({
                button_show: true,
                button_name: "认证",
                show_input: true,
                warning_switch: true,
                warning_content: "未认证潮友，请认证"
            });

        // 连接HC服务器异常-登录
        else if (warningType == "hc_login_fail")
            this.setData({
                button_show: true,
                button_name: '重试',
                show_input: false,
                warning_switch: true,
                warning_content: "连接异常，请重试"
            });

        // 连接HC服务器异常-注册
        else if (warningType == 'hc_register_fail')
            this.setData({
                button_show: true,
                button_name: '认证',
                show_input: true,
                warning_switch: true,
                warning_content: "连接异常，请重试"
            });

        // 安全码错误
        else if (warningType == 'secure_code_fail')
            this.setData({
                warning_switch: true,
                warning_content: "安全码错误"
            });

        // 已经提交申请
        else if (warningType == 'hc_applying')
            this.setData({
                button_show: false,
                show_input: false,
                warning_switch: true,
                warning_content: '申请审核中！'
            })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
