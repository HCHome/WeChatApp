// pages/home/home.js
const app = getApp();
const loginManager = require('../../utils/loginManager.js');
const unitConvert  = require('../../utils/unitConvert.js');
const net4Post     = require('../../utils/net4Post.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        categoryItems: [], // 分类
        notice: [], // 置顶帖子
        posts: [], // 帖子

        // 隐显等界面控制
        hasNotice: true,
        moreTip: "加载更多",

        // 搜索相关
        inputShowed: false,
        inputVal: ""
    },

    _data: {
        postIds: [] // 记录当前的id，用于防止重复
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var tmp = app.globalData.categories.concat();
        tmp.push({ name: '找潮友', img: '/pages/resources/找潮友.png' });
        this.setData({ categoryItems: tmp });
        // 关闭跳转时的loading提示
        wx.hideToast();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 刷新帖子
        this.setData({ posts: [] });
        this._data.postIds = [];
        this.renewPosts();
    },

    /**
     * 拉倒底部进行加载
     */
    onReachBottom: function() {
        if (this.data.moreTip == "加载更多") {
            this.setData({ moreTip: "加载中" });
            this.getMorePosts();
        }
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function() {
        this.setData({ moreTip: "加载中" });
        this.renewPosts();
    },

    /**
     * 分类点击
     */
    category_tap: function(e) {
        var category = e.currentTarget.id;
        if (category == '找潮友')
            wx.navigateTo({ url: '/pages/cylist/cylist' });
        else
            wx.navigateTo({ url: '/pages/category/category?category=' + category });
    },

    /**
     * 点击帖子内容
     */
    notice_tap: function(e) {
        wx.navigateTo({ url: '/pages/postdetail/postdetail?post=' + JSON.stringify(e.currentTarget.dataset.notice) });
    },
    postTap: function(e) {
        wx.navigateTo({
            url: '/pages/postdetail/postdetail?post=' + JSON.stringify(e.detail.post)
        });
    },

    /**
     * 获取帖子相关
     */

    // 获取新的帖子
    renewPosts: function() {
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

    // 获取更多帖子
    getMorePosts: function() {
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
                setTimeout(function() {
                    that.setData({ moreTip: "加载更多" });
                }, 5000);
            }
        })
    },

    /**
     * WeUI搜索的函数
     */
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    /**
     * 搜索
     */
    search_all: function(e) {
        if (this.data.inputVal != "") {
            wx.navigateTo({
                url: '/pages/search/result/result?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
    search_post: function(e) {
        if (this.data.inputVal != "") {
            wx.navigateTo({
                url: '/pages/search/post/post?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
    search_person: function(e) {
        if (this.data.inputVal != "") {
            wx.navigateTo({
                url: '/pages/search/person/person?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
})
