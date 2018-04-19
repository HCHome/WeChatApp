// pages/home/home.js

const app = getApp()
const net4User = require('../../utils/net4User.js')
const authImg = require('./authImg.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showInput: false,
        showApply: false,
        button_text: ""
    },

    _data: {
        inputSecureCode: null,
        inputAuth: null,
        auth_img_code: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({ title: '登录中...', mask: true });
        // 进行登录
        var that = this;
        net4User.login({
            success: res => {
                if (res.data.status) {
                    wx.hideLoading();
                    that.loginHandle(res);
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器错误',
                    image: "/resources/warning.png",
                    mask: true,
                    duration: 1000
                });
                this.setData({ button_text: "重新登录" })
            }
        });
    },

    loginHandle: function(res) {
        switch (res.data.status) {
            // 登录成功
            case 10001:
                wx.showToast({ title: '登录成功！', mask: true, duration: 1000 });
                wx.switchTab({ url: '/pages/home/home' });
                break;
                // 登录后台服务器失败
            case 10002:
            case 10004:
                wx.showToast({
                    title: '服务器错误',
                    image: "/resources/warning.png",
                    mask: true,
                    duration: 1000
                });
                this.setData({ button_text: "重新登录" })
                break;
                // 需要注册
            case 10003:
                wx.showToast({
                    title: '未认证潮友',
                    image: "/resources/warning.png",
                    mask: true,
                    duration: 1000
                });
                this.setData({ showInput: true, showApply: false, button_text: "认证" })
                this.renewAuthimg();
                break;
                // 注册中
            case 10006:
                this._data.applying = res.data.data;
                this.setData({ showInput: false, showApply: true });
                break;
        }
    },

    // 处理输入
    SecureCodeInput: function(e) { this._data.inputSecureCode = e.detail.value; },
    AuthCodeInput: function(e) { this._data.inputAuth = e.detail.value; },

    // 按钮
    buttonClick: function() {
        if (this.data.button_text == '认证')
            this.hc_register();
        else if (this.data.button_text == '重新登录')
            this.onLoad();
    },

    // 刷新验证码
    renewAuthimg: function() {
        this._data.auth_img_code = authImg.randStr();
        authImg.buildImg(this, this._data.auth_img_code, 'auth_img', 108, 44);
    },

    // 申请安全码
    apply: function() { wx.navigateTo({ url: "/pages/apply/apply" }); },

    /**
     * 认证
     */
    hc_register: function() {
        // 检查输入
        if (!this._data.inputSecureCode || this._data.inputSecureCode == '') {
            wx.showToast({
                title: '请输入安全码',
                image: "/resources/warning.png",
                duration: 1000
            })
        } else if (!this.testAuth()) {
            wx.showToast({
                title: '图形验证码错误',
                image: "/resources/warning.png",
                duration: 1000
            })
        } else {
            wx.showLoading({ title: '注册中...', mask: true });
            var that = this;
            loginManager.hc_register({
                secureCode: that._data.inputSecureCode,
                success: res => {
                    wx.hideLoading();
                    that.registerHandler(res);
                },
                fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器错误',
                        image: "/resources/warning.png",
                        mask: true,
                        duration: 1000
                    });
                    that.renewAuthimg();
                }
            });
        }
    },

    registerHandler: function(res) {
        if (res.data.status == 10001) {
            // 注册成功，跳转页面
            wx.showToast({
                title: "登录成功",
                mask: true,
                duration: 1500,
                complete: () => { wx.redirectTo({ url: '/pages/my/userinfosetting/userinfosetting?toHome=true'}); }
            });
        } else if (res.data.status == 10002) {
            // hc服务器异常
            wx.showToast({
                title: '服务器错误',
                image: "/resources/warning.png",
                mask: true,
                duration: 1000
            });
        } else if (res.data.status == 10003) {
            // 安全码错误
            wx.showToast({
                title: '安全码错误',
                image: "/resources/warning.png",
                mask: true,
                duration: 1000
            });
            this.renewAuthimg();
        } else if (res.data.status == 10004) {
            // 登录态过期
            wx.showToast({
                title: '微信登录信息过期',
                image: "/resources/warning.png",
                mask: true,
                duration: 1000
            });
        }
    },

    /**
     * 对验证码进行比对
     */
    testAuth: function() {
        if (!this._data.inputAuth || this._data.inputAuth.length != 4)
            return false;
        else
            return this._data.inputAuth.toUpperCase() == this._data.auth_img_code.toUpperCase();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
