/**
 * 对帖子相关的请求进行封装
 */
const app = getApp();

const _net4Post = {
    _data: {
        sendingPost: null,
        postStatus: null
    },

    // 发帖子
    sendPost: function(Object) {
        var that = this;
        return wx.request({
            url: app.globalData.url_hc + '/post/newPost',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                userId: Object.userId,
                category: Object.category,
                title: Object.title,
                text: Object.text,
                pictureCount: Object.imgs.length
            },
            success: res => {
                that._data.sendingPost = res.data.data.postInfoWithoutImage;
                that._data.postStatus = res.data.status;
                this._sendImgs(Object);
            },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },

    // 发图片
    _sendImgs: function(Object) {
        var that = this;
        var proms = [];
        Object.imgs.forEach((item, index) => {
            proms.push(new Promise((resolve, reject) => {
                wx.uploadFile({
                    url: app.globalData.url_hc + '/post/uploadPostPicture',
                    filePath: item,
                    name: 'postPictureEntity',
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    formData: {
                        postId: that._data.sendingPost.postId,
                        order: index + 1
                    },
                    success: res => { resolve(res); },
                    fail: () => { reject(item); }
                });
            }));
        });
        Promise.all(proms).then(results => {
            if (Object.success && typeof(Object.success) == 'function') Object.success(results);
        }).catch((err) => {
            if (Object.fail && typeof(Object.fail) == 'function') Object.fail();
        });
    },

    // 获取帖子
    getPosts: function(Object) {
        if (Object && Object.userId)
            return this._getUserPostList(Object);
        else if (Object && Object.category) {
            switch (Object.category) {
                case 'top':
                    return this._getFromAll_top(Object);
                case 'all':
                    return this._getFromAll_new(Object);
                default:
                    return this._getFromAll_cate(Object);
            }
        }
    },

    // 简化返回对象
    _simplifyRes: (status, list) => {
        // 处理一下头像的问题
        list.forEach((item, index) => {
            if ((item.posterAvatar == null || item.posterAvatar == "") && item.posterNickname)
                item.letter = item.posterNickname[item.posterNickname.length - 1];
            var date = new Date(item.createdDate);
            item.dateFormat = date;
            item.createdDate = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        });
        // 按最新排序
        list.sort((a, b) => {
            return a.dateFormat - b.dateFormat;
        });
        return { status: status, posts: list };
    },

    // 获取所有人的帖子  置顶
    _getFromAll_top: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/topPosts',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.topPosts);
                if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取所有人的帖子  最新
    _getFromAll_new: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/postListForAll',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                lastPostId: Object.lastPostId ? Object.lastPostId : 0
            },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.postList);
                if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取所有人的帖子  分类
    _getFromAll_cate: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/postListForCategory',
            method: 'POST',
            data: {
                category: Object.category,
                lastPostId: Object.lastPostId ? Object.lastPostId : 0
            },
            header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.postList);
                if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取某个用户的帖子
    _getUserPostList: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/getUserPostList',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: {
                userId: Object.userId,
                lastPostId: Object.lastPostId ? Object.lastPostId : 0
            },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, res.data.data.postList);
                if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        })
    },

    // 删除帖子
    deletePost: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/deletePost',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: {
                userId: Object.userId,
                postId: Object.postId
            },
            success: res => { if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res); },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        });
    },

    // 获取帖子基础信息
    getPostInfo: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/getPostInfoByPostId',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: { postId: Object.postId },
            success: res => {
                if (res.data.status == 10001)
                    res = this._simplifyRes(res.data.status, [res.data.data.postInfo]);
                res.postInfo = res.posts[0];
                if (Object && Object.success && typeof(Object.success) == 'function') Object.success(res);
            },
            fail: () => { if (Object && Object.fail && typeof(Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object && Object.complete && typeof(Object.complete) == 'function') Object.complete(); }
        })
    }
};

module.exports = _net4Post;
