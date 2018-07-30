/**
 * 和用户相关的所有网络操作，包括
 * 1.登录操作：微信登录、用户信息获取、海潮登录、海潮注册、留言申请
 * 1.1 用户微信信息(头像)变更
 * 2.用户搜索、搜索结果处理与筛选
 * 3.用户签到、签到排名
 * 4.用户信息获取与修改
 */

const app = getApp();
var currentUser = require("./currentUser.js")

var _net4User = {

    /***** 1.登录操作：微信登录、用户信息获取、海潮登录、海潮注册、留言申请 *****/

    /**
     * 登录相关的信息保存地
     * @type {Object}
     */
    loginData: {},

    /**
     * 完成微信登录和海潮登录两个操作
     * @param  {function} success 成功拿到最终返回的回调函数
     * @param  {function} fail    未能拿到最终返回的回调函数
     * @return {null}
     */
    login: function(Object) {
        var that = this;
        this.login_wx({
            success: res => {
                that.login_hc(Object);
            },
            fail: () => {
                if (Object && Object.success && typeof(Object.success) == 'function')
                    Object.success({ data: { status: '10004' } });
            }
        });
    },

    /**
     * 微信登录操作
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @return {null}
     */
    login_wx: function(Object) {
        var that = this;
        wx.login({
            success: function(res) {
                that.loginData.js_code = res.code;
                Object.success(res);
            },
            fail: function() {
                that.loginData.js_code = null;
                Object.fail();
            }
        });
    },

    /**
     * 1.1 用户微信信息(头像)变更
     * @param {string} avatarUrl 微信头像信息
     * @return {null}
     */
    setAvatar: function(avatarUrl) {
        this.loginData.avatar = avatarUrl;
    },

    /**
     * 海潮登录操作
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
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
                if (Object && Object.success && typeof(Object.success) == 'function')
                    Object.success(res);
            },
            fail: res => {
                if (Object && Object.fail && typeof(Object.fail) == 'function')
                    Object.fail(res);
            }
        })
    },

    /**
     * 海潮注册
     * @param  {function} success    成功拿到返回的回调函数
     * @param  {function} fail       未能拿到返回的回调函数
     * @param  {String}   secureCode 安全码
     * @return {null}
     */
    register_hc: function(Object) {
        if (this.loginData.emmCode && Object.secureCode) {
            var that = this;
            wx.request({
                url: app.globalData.url_hc + '/user/register',
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    emmCode: that.loginData.emmCode,
                    verificationCode: Object.secureCode,
                    avatar: (that.loginData.avatar ? that.loginData.avatar : '')
                },
                success: res => {
                    if (res.data.status == '10001') currentUser.renewHCInfo(res.data.data.user);
                    if (Object.success && typeof(Object.success) == 'function') Object.success(res);
                },
                fail: res => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
            });
        } else if (!this.loginData.emmCode) {
            if (Object && Object.success && typeof(Object.success) == 'function')
                Object.success({ data: { status: '10004' } });
        } else if (Object && Object.fail && typeof(Object.fail) == 'function')
            Object.fail();
    },

    /**
     * 海潮申请
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @param  {String}   name    用户提供的名字
     * @param  {String}   term    用户提供的年级
     * @param  {String}   message 用户填写的申请信息
     * @return {null}
     */
    apply_hc: function(Object) {
        if (this.loginData.emmCode && Object && Object.name && Object.term) {
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
                    emmCode: that.loginData.emmCode,
                    avatar: that.loginData.avatar ? that.loginData.avatar : ''
                },
                success: res => {
                    if (res.data.status == '10001') that.loginData.user = res.data.data.user;
                    if (Object.success && typeof (Object.success) == 'function') Object.success(res);
                },
                fail: res => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
            });
        } else if (!this.loginData.emmCode) {
            if (Object && Object.success && typeof (Object.success) == 'function')
                Object.success({ data: { status: '10004' } });
        } else if (Object && Object.fail && typeof (Object.fail) == 'function')
            Object.fail();
    },


    /***** 2.用户搜索、搜索结果处理与筛选 *****/

    /**
     * 用关键词搜索用户
     * @param  {function} success   成功拿到返回的回调函数
     * @param  {function} fail      未能拿到返回的回调函数
     * @param  {String}   keyWord   搜索关键词
     * @param  {String}   matchType 关键词搜索的类型范围
     * @return {null}
     */
    search: function(Object) {
        var req = {
            url: app.globalData.url_hc + '/user/searchUser',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { searchWord : Object.keyWord },
            success: res => { if (Object.success && typeof(Object.success) == "function") Object.success(res); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.matchType) req.data.matchType = Object.matchType;
        wx.request(req)
    },

    /**
     * 用户搜索结果处理
     * @param  {list} jobResult        搜索工作的结果
     * @param  {list} nicknameResult   搜索名字的结果
     * @param  {list} professionResult 搜索专业的结果
     * @param  {list} schoolResult     搜索学校的结果
     * @return {list}                  合并后的列表
     */
    mergeUserList: function(jobResult, nicknameResult, professionResult, schoolResult) {
        jobResult.forEach((item, index) => {
            jobResult[index].matchType = "工作";
            jobResult[index].matchVal = item.job;
        });
        nicknameResult.forEach((item, index) => {
            nicknameResult[index].matchType = "nickname";
            nicknameResult[index].matchVal = item.nickname;
        });
        professionResult.forEach((item, index) => {
            professionResult[index].matchType = "专业";
            professionResult[index].matchVal = item.profession;
        });
        schoolResult.forEach((item, index) => {
            schoolResult[index].matchType = "学校";
            schoolResult[index].matchVal = item.school;
        });
        return jobResult.concat(nicknameResult).concat(professionResult).concat(schoolResult)
    },

    /**
     * 筛选用户
     * @param  {String}   searchWord  搜索关键词
     * @param  {int}      lastUserId  列表中最后一个用户的ID
     * @param  {function} success     成功拿到返回的回调函数
     * @param  {function} fail        未能拿到返回的回调函数
     * @param  {int}      term        用户选择的年级
     * @param  {String}   sex         用户选择的性别
     * @param  {boolean}  isSingleDog 用户选择的单身情况
     * @return {null}
     */
    getList: function(Object) {
        var getUserList = require("./getUserList.js");
        getUserList.getResult(Object);
    },

    /****** 3.用户签到、签到排名 *****/

    /**
     * 用户签到
     * @param  {int}      userId  当前用户的ID
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @return {null}
     */
    sign: function(Object) {
        if (Object.userId) return wx.request({
            url: app.globalData.url_hc + '/user/sign',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId
            },
            success: res => { if (Object.success && typeof(Object.success) == 'function') Object.success(res); },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },

    /**
     * 获取签到的排名列表
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @param  {int}      userId  当前用户的ID
     * @return {null}
     */
    signRank: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/user/scoreRankList',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId
            },
            success: res => { if (Object.success && typeof(Object.success) == 'function') Object.success(res); },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        });
    },

    /***** 4.用户信息获取与修改 *****/

    /**
     * 获取用户信息，当获取的信息是当前用户时，会自动更新currentUser的信息
     * @param  {int}      userId  需要获取的用户的ID
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @return {null}
     */
    getUserInfo: function(Object) {
        if (Object.userId) return wx.request({
            url: app.globalData.url_hc + '/user/getUserInfo',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId
            },
            success: res => {
                if (Object.userId == currentUser.data.userId)
                    currentUser.renewHCInfo(res.data.data.user);
                if (Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },

    /**
     * 修改用户的信息
     * @param  {Object} Object 包含各项用户信息和回调函数的对象
     * @return null
     */
    modifyUserInfo: function(Object) {
        // user/modifyUserInfo
        return wx.request({
            url: app.globalData.url_hc + '/user/modifyUserInfo',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId      : Object.userId,
                sex         : Object.sex          ? Object.sex : '',
                school      : Object.school       ? Object.school : '',
                profession  : Object.profession   ? Object.profession : '',
                job         : Object.job          ? Object.job : '',
                term        : Object.term         ? Object.term : '',
                phoneNumber : Object.phoneNumber  ? Object.phoneNumber : '',
                qqNumber    : Object.qqNumber     ? Object.qqNumber : '',
                wechatNumber: Object.wechatNumber ? Object.wechatNumber : '',
                isDisplay   : Object.isDisplay,
                isSingleDog : Object.isSingleDog != '否'
            },
            success: res => { if (Object.success && typeof(Object.success) == 'function') Object.success(res); },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },
};

module.exports = _net4User;
