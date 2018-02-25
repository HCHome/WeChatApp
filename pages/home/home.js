// pages/home/home.js
const app = getApp();
const loginManager = require('../../utils/loginManager.js');
const unitConvert = require('../../utils/unitConvert.js');
const net4Post = require('../../utils/net4Post.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 基础数据
        categoryItems: [],

        notice: [],
        posts: [],

        // 隐显等界面控制
        hasNotice: true,
        moreTip: "加载更多"
    },

    _data: {
        search_word: '', // 搜索词保存
        postIds: []      // 记录当前的id，用于防止重复
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ categoryItems: app.globalData.categories });
        // 关闭跳转时的loading提示
        wx.hideToast();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 刷新帖子
        this.setData({ posts: [] });
        this._data.postIds = [];
        this.renewPosts();
    },

    /**
     * 拉倒底部进行加载
     */
    onReachBottom: function () {
        if (this.data.moreTip == "加载更多") {
            this.setData({ moreTip: "加载中" });
            this.getMorePosts();
        }
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        this.setData({ moreTip: "加载中" });
        this.renewPosts();
    },

    /**
     * 绑定页面的函数
     */

    // 输入搜索词
    search_input: function (e) { this._data.search_word = e.detail.value; },

    // 点击搜索按钮
    search_click: function () {
        // TODO 跳到搜索页面
        console.log(this._data.search_word)
    },

    // 分类点击
    category_tap: function (e) {
        var category = e.currentTarget.id;
        if (category == '找潮友') {
            console.log('找潮友的页面');
            // TODO 找潮友的页面
        } else {
            wx.navigateTo({ url: '../category/category?category=' + category });
        }
    },

    // 点击楼主头像
    postAvatarTap: function (e) {
        // TODO 跳转到新页面
        var user = {};
        user.avatar = e.detail.post.posterAvatar;
        user.id = e.detail.post.posterId;
        console.log(user)
    },

    // 点击帖子内容
    notice_tap: function(e) {
        wx.navigateTo({
            url: '../postdetail/postdetail?post=' + JSON.stringify(e.currentTarget.dataset.notice)
        });
    },
    postTap: function (e) {
        wx.navigateTo({
            url: '../postdetail/postdetail?post=' + JSON.stringify(e.detail.post)
        });
    },

    /**
     * 后台调用的自定义函数
     */

    // 获取新的帖子
    renewPosts: function () {
        wx.showNavigationBarLoading();
        var that = this;
        net4Post.getPosts({
            category: 'top',
            success: res => {
                if (res.status == 10001) that.setData({ notice: res.posts });
                if (res.posts.length == 0) that.setData({ hasNotice: false });
            },
            complete: () => {
                net4Post.getPosts({
                    category: 'all',
                    success: res => {
                        if (res.status == 10001) {
                            var posts = that.data.posts;
                            res.posts.forEach(item => {
                                if (!that._data.postIds.includes(item.postId)) {
                                    posts.unshift(item);
                                    that._data.postIds.push(item.postId);
                                }
                            });
                            that.setData({ posts: posts });
                        }
                    },
                    complete: () => {
                        wx.stopPullDownRefresh();
                        wx.hideNavigationBarLoading();
                    }
                });
            }
        });

    },

    getMorePosts: function () {
        wx.showNavigationBarLoading();
        var that = this;
        net4Post.getPosts({
            category: 'all',
            lastPostId: that.data.posts[0] ? that.data.posts[that.data.posts.length - 1].postId : 0,
            success: res => {
                if (res.status == 10001) {
                    var posts = that.data.posts;
                    res.posts.forEach(item => {
                        if (!that._data.postIds.includes(item.postId)) {
                            posts.push(item);
                            that._data.postIds.push(item.postId);
                        }
                    });
                    that.setData({ posts: posts });
                }
            },
            complete: () => {
                wx.hideNavigationBarLoading();
                this.setData({ moreTip: "暂无更多" });
                var that = this;
                setTimeout(function () {
                    that.setData({ moreTip: "加载更多" });
                }, 5000);
            }
        })
    }
})
