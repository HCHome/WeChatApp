// pages/person/person.js
const loginManager = require('../../utils/loginManager.js');
const net4Post = require('../../utils/net4Post.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        letter: '?',
        avatar: '/pages/resource/占位图.png',
        nickName: '',
        hasGender: false,
        gender_img: '',
        job: '',
        myPost: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            letter  : loginManager.hc_info.user.letter,
            avatar  : loginManager.hc_info.user.avatar,
            nickName: loginManager.hc_info.user.nickname
        });
        this.getMyPosts();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 获取我的列表
     */
    getMyPosts: function() {
        wx.showLoading({ title: '更新帖子中...', mask: true })
        var that = this;
        net4Post.getPosts({
            userId: loginManager.hc_info.user.userId,
            success: function(res) {
                wx.hideLoading();
                if (res.status == 10001) {
                    that.setData({ myPost: null});
                    that.setData({ myPost: res.posts });
                }
            }
        })
    },

    /**
     * 跳转到个人信息修改页面
     */
    infoModify: function(e) {
        wx.navigateTo({ url: '/pages/userinfosetting/userinfosetting' });
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
                            console.log(res);
                            wx.hideLoading();
                            wx.navigateTo({ url: '../postdetail/postdetail?post=' + JSON.stringify(res.postInfo) });
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
