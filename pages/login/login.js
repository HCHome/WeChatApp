// pages/home/home.js
const loadingImg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=";

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
        button_text: "",
        img_src: loadingImg
    },

    _data: {
        inputSecureCode: null,
        inputAuth: null,
        auth: {
            state: null,
            interval: 500,
            str: null
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.setData({
        //     showInput: true,
        //     showApply: true,
        //     button_text: "注册",
        // })
        // return;
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
                this.setData({ showInput: true, showApply: false, button_text: "认证" });
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

    /**
     * 刷新验证码
     */
    renewAuthimg: function () {
        this.setData({ img_src: loadingImg });
        this._data.auth.str = authImg.randStr();
        this._data.auth.state = null;
        var that = this;
        authImg.buildImg({
            content: this,
            authCode: this._data.auth.str,
            canvasId: 'auth_img',
            width: 108,
            height: 44,
            interval: this._data.auth.interval,
            success: res => {
                that._data.auth.interval = Math.max(500, that._data.auth.interval/2);
                that._data.auth.state = true;
                that.setData({ img_src: res });
            },
            fail: () => {
                that._data.auth.state = false;
                that._data.auth.interval += 500;
                that.setData({ img_src: null })
            }
        });
    },

    /**
     * 对验证码进行比对
     */
    testAuth: function () {
        if (!this._data.inputAuth || this._data.inputAuth.length != 4)
            return false;
        else
            return this._data.inputAuth.toUpperCase() == this._data.auth.str.toUpperCase();
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
            net4User.register_hc({
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
                complete: () => { wx.redirectTo({ url: '/pages/setting/setting?toHome=true'}); }
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
    }
})
