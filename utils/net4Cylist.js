const app = getApp();

module.exports = {
    getList: function(Object) {
        var req = {
            url: app.globalData.url_hc + '/user/searchUser',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                lastUserId: Object && Object.lastUserId ? lastUserId : 0
            },
            success: res => { if (Object && typeof(Object.success) == 'function') Object.success(res); },
            fail: () => { if (Object && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.term) req.data.term = Object.term;
        if (Object && Object.sex) req.data.sex = Object.sex;
        if (Object && typeof(Object.isSingleDog) != "undefined") req.data.isSingleDog = Object.isSingleDog;
        wx.request(req)
    }
}
