const net4Post = require('../../../utils/net4Post.js')
const loginManager = require('../../../utils/loginManager.js')

// pages/myposts/myposts.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        posts: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getMyPosts();
    },

    /**
     * 获取我的帖子列表
     */
    getMyPosts: function() {
        wx.showLoading({ title: '更新帖子中...', mask: true })
        var that = this;
        net4Post.getPosts({
            userId: loginManager.hc_info.user.userId,
            success: function(res) {
                res.posts.forEach(item => {
                    if (loginManager.hc_info.user.letter) item.letter = loginManager.hc_info.user.letter;
                    if (loginManager.hc_info.user.avatar) item.posterAvatar = loginManager.hc_info.user.avatar;
                })
                if (res.status == 10001) {
                    that.setData({ posts: null });
                    that.setData({ posts: res.posts });
                }
                wx.hideLoading();
            }
        })
    },

    /**
     * 点击帖子
     */
    postTap: function(e) {
        wx.showActionSheet({
            itemList: ['详情', '删除'],
            success: res => {
                if (res.tapIndex == 0) {
                    wx.showLoading({ title: '跳转中...', mask: true });
                    net4Post.getPostInfo({
                        postId: e.currentTarget.dataset.post.postId,
                        success: res => {
                            wx.hideLoading();
                            wx.navigateTo({ url: '/pages/postdetail/postdetail?post=' + JSON.stringify(res.postInfo) });
                        }
                    })
                } else if (res.tapIndex == 1) this.deletePost(e.currentTarget.dataset.post);
            }
        });
    },

    /**
     * 删除帖子
     */
    deletePost: function(post) {
        wx.showLoading({ title: '删除中...', mask: true });
        var that = this;
        net4Post.deletePost({
            userId: loginManager.hc_info.user.userId,
            postId: post.postId,
            success: res => {
                console.log(res);
                wx.hideLoading();
                wx.showToast({ title: '删除成功', duration: 1200 });
                that.getMyPosts();
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
