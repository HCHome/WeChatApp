/**
 * 工具类loginManager
 * 对整个程序的登录进行管理
 */
const app = getApp()

const _loginManager = {
    // 保存用于和hc服务器交流的信息
    hc_info: {
        emmCode: null,
        user: null
    },

    // 保存用于和wx服务器交流的信息
    wx_info: {
        js_code: null,
        nickName: null,
        avatar: null
    },

    // 保存模块内部使用的变量
    _data: {
        wx_login_count: 0
    },

    /**
     * 更新数据
     */
    setHC_info: function(Object) {
        for (var item in Object) {
            this.hc_info[item] = Object[item];
        }
    },

    /**
     * 完整的登录操作，最终回调获取的是HC的返回
     */
    login: function(Object) {
        var that = this;
        this.wx_login({
            success: res => {
                // 获取头像，无论成败，都进行hc登录
                that.get_wxInfo({
                    success: function () { that.hc_login(Object); },
                    fail: function () { that.hc_login(Object); }
                });
            },
            fail: () => { if (Object && Object.success && typeof (Object.success) == 'function') Object.success({ data: { status: '10004' } }); }
        });
    },

    /**
     * 微信相关：登录、获取信息
     */

    // 微信登录
    wx_login: function (Object) {
        // 会自动重试三次
        if (this._data.wx_login_count == 3) {
            if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail();
            this._data.wx_login_count = 0;
        } else {
            this._data.wx_login_count++;
            var that = this;
            wx.login({
                success: function (res) {
                    that._data.wx_login_count = 0;
                    that.wx_info.js_code = res.code;
                    if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
                },
                fail: function () {
                    that.wx_info.js_code = null;
                    if (that._data.wx_login_count < 3)
                        that.wx_login(); // 重试
                    else
                        if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail();
                }
            });
        }
    },

    // 获取用户微信信息
    get_wxInfo: function (Object) {
        var that = this;
        wx.getUserInfo({
            success: res => {
                that.wx_info.nickName = res.userInfo.nickName;
                that.wx_info.avatar = res.userInfo.avatarUrl;
                if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
        })
    },

    /**
     * hc相关：登录、注册
     */

    // hc登录
    hc_login: function (Object) {
        if (this.wx_info.js_code) {
            var that = this;
            wx.request({
                url: app.globalData.url_hc + '/user/login',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    jsCode: that.wx_info.js_code,
                    avatar: (that.wx_info.avatar ? that.wx_info.avatar : '')
                },
                success: res => {
                    if (res.data.status == '10001') {
                        that.hc_info.user = res.data.data.user;
                        if (that.hc_info.user.avatar)
                            that.hc_info.user.letter = that.hc_info.user.nickname[that.hc_info.user.nickname.length - 1];
                    }
                    if (res.data.data.emmCode) that.hc_info.emmCode = res.data.data.emmCode;
                    if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
                },
                fail: res => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(res); }
            });
        }
        // js_code为空，调用success，假装已经wx登录成功但是过期了
        else if (Object && Object.success && typeof (Object.success) == 'function') Object.success({ data: { status: '10004' } });
    },

    // hc注册-1：安全码形式
    hc_register: function (Object) {
        if (this.hc_info.emmCode && Object && Object.secureCode) {
            // 所需信息完整，即开始请求
            var that = this;
            wx.request({
                url: app.globalData.url_hc + '/user/register',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    emmCode: that.hc_info.emmCode,
                    verificationCode: Object.secureCode,
                    avatar: (that.wx_info.avatar ? that.wx_info.avatar : '')
                },
                success: res => {
                    if (res.data.status == '10001') that.hc_info.user = res.data.data.user;
                    if (Object.success && typeof (Object.success) == 'function') Object.success(res);
                },
                fail: res => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
            });
        } else if (!this.hc_info.emmCode) {
            if (Object && Object.success && typeof (Object.success) == 'function') Object.success({ data: { status: '10004' } });
        } else if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail();
    },

    // hc注册-2：留言申请
    hc_apply: function (Object) {
        if (this.hc_info.emmCode && Object && Object.name && Object.term) {
            // 检查所需信息，完整即开始请求
            var that = this;
            wx.request({
                url: app.globalData.url_hc + '/user/apply',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    term: Object.term,
                    name: Object.name,
                    message: (Object.message ? Object.message : '空'),
                    emmCode: that.hc_info.emmCode,
                    avatar: that.wx_info.avatar ? that.wx_info.avatar : ''
                },
                success: res => {
                    if (res.data.status == '10001') that.hc_info.user = res.data.data.user;
                    if (Object.success && typeof (Object.success) == 'function') Object.success(res);
                },
                fail: res => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
            });
        } else if (!this.hc_info.emmCode) {
            if (Object && Object.success && typeof (Object.success) == 'function') Object.success({ data: { status: '10004' } });
        } else if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail();
    },

    // hc注销
    hc_logout: function (Object) {
        if (this.hc_info.user && this.hc_info.user.userId) {
            var that = this;
            wx.request({
                url: app.globalData.url_hc + '/user/logout',
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    userId: that.hc_info.user.userId
                },
                success: res => { if (Object.success && typeof (Object.success) == 'function') Object.success(res); },
                fail: res => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
            })
        }
    }
}

module.exports = _loginManager;
