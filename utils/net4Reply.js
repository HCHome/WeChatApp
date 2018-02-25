/**
 * 帖子相关的操作
 */
const app = getApp();
var _net4Reply = {
    // 获取回复
    getReply: function (Object) {
        if (Object.postId) return wx.request({
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
    // 发回复
    postReply: function (Object) {
        if (Object.text) {
            return wx.request({
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

    // 删除回复
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
    }
}

module.exports = _net4Reply;
