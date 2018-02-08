/**
 * 对帖子相关的请求进行封装
 */
const app = getApp();

const _net4Post = {
    _data: {
    },

    // 获取帖子
    getPosts: function (Object) {
        if (Object && Object.category) {
            switch (Object.category) {
                case 'top':
                    return this._getFromAll_top(Object);
                    break;
                case 'all':
                    return this._getFromAll_new(Object);
                    break;
                default:
                    return this._getFromAll_cate(Object);
            }
        }
    },

    // 简化返回对象
    _simplifyRes: (status, list) => {
        for (var i = 0; i < list.length; i++) {
            if (list[i].posterAvatar == null || list[i].posterAvatar == "''")
                list[i].letter = list[i].posterNickname[list[i].posterNickname.length - 1];
            var date = new Date(list[i].createdDate);
            list[i].createdDate = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        }
        return { status: status, posts: list };
    },

    // 获取所有人的帖子  置顶
    _getFromAll_top: function (Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/topPosts',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.topPosts);
                if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取所有人的帖子  最新
    _getFromAll_new: function (Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/postListForAll',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId ? Object.userId : 1,
                lastPostId: Object.lastPostId ? Object.lastPostId : 0
            },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.postList);
                if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取所有人的帖子  分类
    _getFromAll_cate: function (Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/postList',
            method: 'POST',
            data: {
                userId: Object.userId ? Object.userId : 1,
                category: Object.category,
                lastPostId: Object.lastPostId ? Object.lastPostId : 0
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        });
    }
};

module.exports = _net4Post;