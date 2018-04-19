// pages/category/category.js
const net4Post = require('../../utils/net4Post.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postLists: [],
        tip: '加载更多'
    },

    /**
     * 后台使用的数据
     */
    _data: {
        category: null,
        postIds: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._data.category = options.category;
        wx.setNavigationBarTitle({ title: options.category });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.showNavigationBarLoading();
        this.setData({ tip: '正在加载' });
        this.renewPosts();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.setData({ tip: '正在加载' })
        this.renewPosts();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.tip == '加载更多') {
            wx.showNavigationBarLoading();
            this.setData({ tip: '正在加载' })
            this.renewPosts();
        }
    },

    /**
     * 点击帖子内容
     */
    postTap: function (e) {
        var post = e.detail.post;
        wx.navigateTo({
            url: '/pages/postDetail/postDetail?post=' + JSON.stringify(post)
        });
    },

    /**
     * 后台自定义函数
     */
    renewPosts: function () {
        var that = this;
        net4Post.getPosts({
            category: that._data.category,
            success: res => {
                if (res.status == 10001) {
                    var posts = that.data.postLists;
                    res.posts.forEach(item => {
                        if (!that._data.postIds.includes(item.postId)) {
                            posts.unshift(item);
                            that._data.postIds.push(item.postId);
                        }
                    });
                    that.setData({ postLists: posts });
                }
            },
            complete: () => {
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading();
                that.setData({ tip: '暂无更多帖子' });
                setTimeout(function () {
                    that.setData({ tip: '加载更多' });
                }, 10 * 1000);
            }
        });
    },

    getMorePosts: function () {
        var that = this;
        net4Post.getPosts({
            category: that._data.category,
            lastPostId: that.data.posts.length == 0 ? 0 : that.data.posts[that.data.posts.length - 1].postId,
            success: res => {
                if (res.status == 10001) {
                    var posts = that.data.postLists;
                    res.posts.forEach(item => {
                        if (!that._data.postIds.includes(item.postId)) {
                            posts.push(item);
                            that._data.postIds.push(item.postId);
                        }
                    });
                    that.setData({ postLists: posts });
                }
            },
            complete: () => {
                wx.hideNavigationBarLoading();
                that.setData({ tip: '暂无更多帖子' });
                setTimeout(function () {
                    that.setData({ tip: '加载更多' });
                }, 10 * 1000);
            }
        });
    }
})
