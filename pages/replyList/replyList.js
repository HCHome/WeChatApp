// pages/receivemsg/receivemsg.js
const currentUser = require('../../utils/currentUser.js')
const net4Post = require('../../utils/net4Post.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        replies: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        net4Post.getMyReceivedReplies({
            userId: currentUser.data.userId,
            success: res => {
                this.setData({ replies: res.data.data.receivedReplies })
            }
        })
    },

    /**
     * 点击回复
     */
    onReplyTap: function(e) {
        wx.showLoading({ title: '跳转中...', mask: true });
        net4Post.getPostInfo({
            postId: e.currentTarget.dataset.reply.postId,
            success: res => {
                wx.hideLoading();
                wx.navigateTo({
                    url: '/pages/postDetail/postDetail?post=' + JSON.stringify(res.postInfo) +
                        '&replyId=' + e.currentTarget.dataset.reply.replyId
                });
            }
        })
    }
})
