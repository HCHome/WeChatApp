const app = getApp();
const loginManager = require('loginManager.js')

var _net4User = {
    // 签到排名
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
    // 签到
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
    // 获取用户详细信息
    getUserInfo: function(Object) {
        if (Object.userId) return wx.request({
            url: app.globalData.url_hc + '/user/getUserInfo',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId
            },
            success: res => {
                // 如果是当前人物，把新增的信息放进loginManager
                if (Object.userId == loginManager.hc_info.user.userId) {
                    var user = res.data.data.user;
                    loginManager.setHC_info(user);
                }
                if (Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },
    // 获取我的消息
    getMyReceivedReplies: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/getMyReceivedReplies',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId,
                lastReplyId: Object.lastReplyId ? Object.lastReplyId : 0
            },
            success: res => { if (Object.success && typeof(Object.success) == 'function') Object.success(res); },
            complete: () => { if (Object.complete && typeof(Object.complete) == 'function') Object.complete(); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        });
    },
    // 修改个人信息
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
    }
}

module.exports = _net4User;
