const net4Post = require('../../utils/net4Post.js')
const currentUser = require('../../utils/currentUser.js')

// pages/myposts/myposts.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        posts: []
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
            userId: currentUser.data.userId,
            success: function(res) {
                res.posts.forEach(item => {
                    item.posterNickname = currentUser.data.nickname;
                    if (currentUser.data.avatar) item.posterAvatar = currentUser.data.avatar;
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
                            wx.navigateTo({ url: '/pages/postDetail/postDetail?post=' + JSON.stringify(res.postInfo) });
                        }
                    })
                } else if (res.tapIndex == 1) {
                    this.deletePost(e.currentTarget.dataset.post);
                }
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
            userId: currentUser.data.userId,
            postId: post.postId,
            success: res => {
                console.log(res);
                wx.hideLoading();
                wx.showToast({ title: '删除成功', duration: 1200 });
                that.getMyPosts();
            }
        })
    },
})
