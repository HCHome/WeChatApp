/**
 * 和帖子相关的操作，包括
 * 0.内部工具类
 * 1.请求帖子列表：只提供一个入口，然后再在内部进行分流
 * 2.获取帖子的基础信息
 * 3.发帖、删帖
 * 4.搜索帖子（需要取消）
 * 5.获取、发送、删除回复；获取当前用户收到的回复
 */
var app = getApp()

var _net4Post = {

    /***** 0.内部工具类 *****/

    /**
     * 简化返回对象
     * @param  {int}    status 海潮服务器给过来的状态
     * @param  {list}   list   帖子列表
     * @return {Object}        包含状态码和排序后的列表的对象
     */
    _simplifyRes: (status, list) => {
        list.forEach((item, index) => {
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

    /***** 1.请求帖子列表：只提供一个入口，然后再在内部进行分流 *****/
    /**
     * 包括获取全部帖子、置顶帖子、分类、某个人的帖子
     * 另外有一个使用的处理函数
     */

    /**
     * 获取帖子的总入口
     * @param  {Object} Object 包含回调函数和参数
     *                         可选参数：lastPostId 列表中最后一个帖子的ID
     *                         可选参数：category   分类
     *                         可选参数：userId     针对性获取的用户ID
     * @return {null}
     */
    getPosts: function(Object) {
        if (Object && Object.userId)
            this._getUserPostList(Object);
        else if (Object && Object.category) {
            switch (Object.category) {
                case 'top':
                    this._getFromAll_top(Object);
                    break;
                case 'all':
                    this._getFromAll_new(Object);
                    break;
                default:
                    this._getFromAll_cate(Object);
            }
        }
    },

    /**
     * 获取置顶帖子
     * @param  {Object} Object 包含回调函数
     * @return {null}
     */
    _getFromAll_top: function(Object) {
        wx.request({
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

    /**
     * 获取最新帖子
     * @param  {Object} Object 包含回调函数和参数
     *                         可选参数：lastPostId 列表中最后一个帖子的ID
     * @return {null}
     */
    _getFromAll_new: function(Object) {
        wx.request({
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

    /**
     * 获取分类中的帖子
     * @param  {function} success    成功拿到返回的回调函数
     * @param  {function} fail       未能拿到返回的回调函数
     * @param  {String}   category   分类
     * @param  {int}      lastPostId 列表中最后一个帖子的ID
     * @return {null}
     */
    _getFromAll_cate: function(Object) {
        wx.request({
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

    /**
     * 获取特定用户的帖子
     * @param  {int} userId     用户ID
     * @param  {int} lastPostId 列表中最后一个帖子的ID
     * @return {null}
     */
    _getUserPostList: function(Object) {
        wx.request({
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


    /***** 2.获取帖子的基础信息 *****/

    /**
     * 获取帖子的基础信息
     * @param  {function} success 成功拿到返回的回调函数
     * @param  {function} fail    未能拿到返回的回调函数
     * @param  {int}      postId  要获取的帖子ID
     * @return {null}
     */
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
    },

    /***** 3.发帖、删帖 *****/

    /**
     * 发帖过程用到的数据
     * @type {Object}
     */
    data_send: {
        sendingPost: null
    },
    /**
     * 发送帖子
     * @param  {Object} Object 包含帖子的所有信息和回调函数
     * @return {null}
     */
    sendPost: function(Object) {
        var that = this;
        wx.request({
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
                that.data_send.sendingPost = res.data.data.postInfoWithoutImage;
                this._sendImgs(Object);
            },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        })
    },

    /**
     * 发送多张图片，顺序发送，完成后调用回调函数
     * @param  {Object} Object 传给sendPost的对象
     * @return {null}
     */
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
                        postId: that.data_send.sendingPost.postId,
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

    /**
     * 删除帖子
     * @param {int}      Object  发帖者的用户ID
     * @param {int}      postId  帖子的ID
     * @param {function} success 成功拿到返回的回调函数
     * @param {function} fail    未能拿到返回的回调函数
     * @return {null}
     */
    deletePost: function(Object) {
        wx.request({
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

    /***** 4.搜索帖子（需要取消） *****/

    /**
     * 搜索帖子
     * @param {String}   keyWord    关键词
     * @param {String}   category   分类
     * @param {int}      lastPostId 搜索结果中的最后一个帖子ID
     * @param {function} success    成功拿到返回的回调函数
     * @param {function} fail       未能拿到返回的回调函数
     * @return {requestTask}        请求任务的对象，通过这个进行取消
     */
    search: function(Object) {
        var that = this;
        var req = {
            url: app.globalData.url_hc + '/post/searchPosts',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { searchWord : Object.keyWord },
            success: res => {
                if (Object.success && typeof(Object.success) == "function")
                    Object.success(that._simplifyRes(res.data.status, res.data.data.postList));
            },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.category) req.data.category = Object.category;
        if (Object && Object.lastPostId) req.data.lastPostId = Object.lastPostId;
        return wx.request(req)
    },

    /***** 5.获取、发送、删除回复 *****/

    /**
     * 获取指定帖子的回复列表
     * @param  {Object} Object 回调函数和参数
     *                         参数：    postId      要获取的帖子的ID
     *                         可选参数：lastReplyId 列表中的最后一个回复ID
     * @return {null}
     */
    getReply: function (Object) {
        if (Object.postId)
            wx.request({
                url: app.globalData.url_hc + '/post/postReplies',
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    lastReplyId: Object.lastReplyId ? Object.lastReplyId : 0,
                    postId: Object.postId
                },
                success: res => {
                    if (res.data.status == 10001 && Object.success && typeof (Object.success) == 'function')
                        Object.success({
                            status: res.data.status,
                            replyList: res.data.data.replyList
                        });
                },
                complete: () => { if (Object.complete && typeof (Object.complete) == 'function') Object.complete(); },
                fail: () => { if (Object.fail && typeof (Object.fail) == 'function') Object.fail(); }
            });
    },

    /**
     * 发送回复
     * @param  {int}    userId             回复人的ID
     * @param  {int}    postId             被回复的帖子的ID
     * @param  {int}    posterId           楼主的ID
     * @param  {int}    repliedFloor       被回复的楼层的ID
     * @param  {int}    repliedFloorUserId 被回复的层的用户ID
     * @param  {String} text               回复的内容文本
     * @param  {function} success    成功拿到返回的回调函数
     * @param  {function} fail       未能拿到返回的回调函数
     * @return {null}
     */
    postReply: function (Object) {
        if (Object.text) {
            wx.request({
                url: app.globalData.url_hc + '/post/addReply',
                method: 'POST',
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                data: {
                    userId: Object.userId,
                    postId: Object.postId,
                    repliedFloor : Object.repliedFloor ? Object.repliedFloor : 0,
                    repliedFloorUserId: Object.repliedFloor ? Object.repliedFloorUserId : Object.posterId,
                    posterId: Object.posterId,
                    text: Object.text
                },
                success: res => { if (Object.success && typeof (Object.success) == 'function') Object.success(res); },
                fail: () => { if (Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
                complete: () => { if (Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
            });
        }
    },


    /**
     * 删除回复
     * @param  {Object} Object 包含回调函数和replyId，被删除的回复的ID
     * @return {null}
     */
    deleteReply: function(Object) {
        return wx.request({
            url: app.globalData.url_hc + '/post/deleteReply',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { replyId: Object.replyId },
            success: res => { if (Object.success && typeof (Object.success) == 'function') Object.success(res); },
            fail: () => { if (Object.fail && typeof (Object.fail) == 'function') Object.fail(); },
            complete: () => { if (Object.complete && typeof (Object.complete) == 'function') Object.complete(); }
        })
    },

    /***** 6.获取当前用户收到的回复  *****/

    /**
     * 获取当前用户收到的回复
     * @param {function} success     成功拿到返回的回调函数
     * @param {function} fail        未能拿到返回的回调函数
     * @param {int}      lastReplyId 列表中最后一个回复的ID
     * @param {int}      userId      当前用户的ID
     * @return {null}
     */
    getMyReceivedReplies: function(Object) {
        wx.request({
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
}

module.exports = _net4Post;
