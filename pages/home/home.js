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
        categoryItems: [
            { name: '实习就业', img: '../resource/占位图.png' },
            { name: '海潮日常', img: '../resource/占位图.png' },
            { name: '学习交流', img: '../resource/占位图.png' },
            { name: '求助发帖', img: '../resource/占位图.png' },
            { name: '线上活动', img: '../resource/占位图.png' },
        ],

        notice: null,
        posts: null,

        // 隐显等界面控制
        hasNotice: true,
        moreTip: "加载更多"
    },

    _data: {
        search_word: '' // 搜索词保存
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 关闭跳转时的loading提示
        wx.hideToast();
        this.renewPosts();
        console.log("home")
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
    onPullDownRefresh: function () { this.renewPosts(); },

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
        // TODO 跳转到新页面
        console.log(category);
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
    postTap: function (e) {
        // TODO 跳转到新页面
        var post = e.detail.post;
        console.log(post)
    },

    /**
     * 后台调用的自定义函数
     */

    renewPosts: function () {
        var that = this;
        net4Post.getPosts({
            category: 'top',
            success: res => { if (res.status == 10001) that.setData({ notice: res.posts }); },
            complete: () => {
                net4Post.getPosts({
                    category: 'all',
                    success: res => { if (res.status == 10001) that.setData({ posts: res.posts }); },
                    complete: () => { wx.stopPullDownRefresh(); }
                });
            }
        });

    },

    getMorePosts: function () {
        var that = this;
        net4Post.getPosts({
            category: 'all',
            lastPostId: that.data.posts ? that.data.posts[that.data.posts.length - 1].postId : 0,
            success: res => {
                if (res.status == 10001) {
                    var posts = that.data.posts;
                    res.posts.forEach(function (item) {
                        posts.push(item);
                    });
                    that.setData({ posts: posts });
                }
            },
            complete: () => {
                this.setData({ moreTip: "暂无更多" });
                var that = this;
                setTimeout(function () {
                    that.setData({ moreTip: "加载更多" });
                }, 5000);
            }
        })
    }
})