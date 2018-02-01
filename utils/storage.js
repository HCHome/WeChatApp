const _storage = {
    keys: {
        post: 'posts'

    },
    // 将帖子保存到缓存里
    savePosts: function (posts, Object) {
        wx.setStorage({
            key: keys.posts,
            data: posts,
            success: function () { if (Object && Object.success && typeof (Object.success) == 'function') Object.success(); },
            fail: function () { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: function () { if (Object && Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        })
    },
    // 读取缓存里的帖子
    loadPosts: function (Object) {
        wx.getStorage({
            key: keys.posts,
            success: function (res) { if (Object && Object.success && typeof (Object.success) == 'function') Object.success(res.data); },
            fail: function () { if (Object && Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: function () { if (Object && Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        })
    }
};

module.exports = _storage;