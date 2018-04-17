/**
 * 和用户相关的所有网络操作，包括
 * 1.登录操作：微信登录、用户信息获取、海潮登录、海潮注册
 * 2.
 */

const app = getApp();
var currentUser = require("./currentUser.js")

var _net4User = {

    /***** 1.登录操作：微信登录、用户信息获取、海潮登录、海潮注册 *****/

    /**
     * 登录相关的信息保存地
     * @type {Object}
     */
    loginData: {},

    /**
     * 完成微信登录和海潮登录两个操作
     * @param  {Object} Object 包含回调函数和参数
     * @return {null}
     */
    login: function(Object) {
        var that = this;
        this.login_wx({
            success: res => {
                // 获取头像，无论成败，都进行hc登录
                that.getWxInfo({
                    success: function () { that.login_hc(Object); },
                    fail: function () { that.login_hc(Object); }
                });
            },
            fail: () => {
                if (Object && Object.success && typeof (Object.success) == 'function')
                   Object.success({ data: { status: '10004' } });
           }
       });
    },

    /**
     * 微信登录操作
     * @param  {Object} Object 包含回调函数
     * @return {null}
     */
    login_wx: function(Object) {
        var that = this;
        wx.login({
            success: function (res) {
                that.loginData.js_code = res.code;
                Object.success(res);
            },
            fail: function () {
                that.loginData.js_code = null;
                Object.fail();
            }
        });
    },

    /**
     * 获取用户的微信信息
     * @param  {Object} Object 包含回调函数
     * @return {null}
     */
    getWxInfo: function(Object) {
        var that = this;
        wx.getUserInfo({
            success: res => {
                that.loginData.avatar = res.userInfo.avatarUrl;
                Object.success(res);
            },
            fail: () => { Object.fail(); }
        })
    },

    /**
     * 海潮登录操作
     * @param  {Object} Object 包含回调函数和参数
     * @return {null}
     */
    login_hc: function(Object) {
        var that = this;
        if (this.loginData.js_code) wx.request({
            url: app.globalData.url_hc + '/user/login',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                jsCode: that.loginData.js_code,
                avatar: (that.loginData.avatar ? that.loginData.avatar : '')
            },
            success: res => {
                // 登录成功进行信息更新
                if (res.data.status == '10001') currentUser.renewHCInfo(res.data.data.user);
                // 返回了奇怪的信息
                if (res.data.data.emmCode) that.loginData.emmCode = res.data.data.emmCode;
                if (Object && Object.success && typeof (Object.success) == 'function')
                    Object.success(res);
            },
            fail: res => {
                if (Object && Object.fail && typeof (Object.fail) == 'function')
                    Object.fail(res);
            }
        })
    },
};


module.exports = _net4User;
