// pages/home/home.js
const app = getApp();
const net4Post = require('../../utils/net4Post.js');

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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var tmp = app.globalData.categories.concat();
        tmp.push({ name: '找潮友', img: '/resources/找潮友.png' });
        this.setData({ categoryItems: tmp });
        // 关闭跳转时的loading提示
        wx.hideToast();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({ posts: [] });
        this._data.postIds = [];
        this.getTopPost();
        this.getLastPost();
    },

    /***** 帖子相关的处理 *****/

    /**
     * 帖子ID保存
     */
    _data: {
        postIds: [] // 记录当前的id，用于防止重复
    },

    /**
     * 获取置顶的帖子
     */
    getTopPost: function() {
        var that = this;
        net4Post.getPosts({
            category: 'top',
            success: res => {
                if (res.status == 10001) that.setData({ notice: res.posts });
                if (res.posts.length == 0) that.setData({ hasNotice: false });
            },
            fail: () => {
                that.setData({ hasNotice: false });
            }
        })
    },

    /**
     * 获取最新的帖子
     */
    getLastPost: function() {
        wx.showNavigationBarLoading();
        var that = this;
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
    },

    /**
     * 获取更多帖子
     */
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
        this.getLastPost();
    },

    /**
     * 分类点击
     */
    category_tap: function(e) {
        var category = e.currentTarget.id;
        if (category == '找潮友')
            wx.navigateTo({ url: '/pages/userList/userList' });
        else
            wx.navigateTo({ url: '/pages/category/category?category=' + category });
    },

    /**
     * 点击帖子内容
     */
    notice_tap: function(e) {
        wx.navigateTo({ url: '/pages/postDetail/postDetail?post=' + JSON.stringify(e.currentTarget.dataset.notice) });
    },
    postTap: function(e) {
        wx.navigateTo({
            url: '/pages/postDetail/postDetail?post=' + JSON.stringify(e.detail.post)
        });
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
                url: '/pages/search/search?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
    search_post: function(e) {
        if (this.data.inputVal != "") {
            wx.navigateTo({
                url: '/pages/search4Post/search4Post?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
    search_person: function(e) {
        if (this.data.inputVal != "") {
            wx.navigateTo({
                url: '/pages/search4Person/search4Person?keyWord=' + this.data.inputVal
            });
            this.hideInput();
        }
    },
})
