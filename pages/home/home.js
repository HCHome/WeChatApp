// pages/home/home.js
const app = getApp();
const loginManager = require('../../utils/loginManager.js');
const unitConvert = require('../../utils/unitConvert.js');

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
            { name: '线上活动', img: '../resource/占位图.png' },
            { name: '求助发帖', img: '../resource/占位图.png' },
        ],

        notice: {
            userid: 1,
            username: "帆会",
            avatar: '/pages/resource/占位图.png',
            title: "标题",
            category: "公告栏",
            date: '2000.1.1',
            content: "内容内容内容内容内容内容内容内容",
            imgs: [
                { id: 1, src: '/pages/resource/占位图.png' },
                { id: 2, src: '/pages/resource/占位图.png' },
                { id: 3, src: '/pages/resource/占位图.png' },
                { id: 4, src: '/pages/resource/占位图.png' },
            ]
        },

        posts: [
            {
                id: 1,
                userid: 1,
                username: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "分类1",
                date: '2000.1.1',
                content: "内容内容内容内容内容内容内容内容",
                imgs: [
                    { id: 1, src: '/pages/resource/占位图.png' },
                    { id: 2, src: '/pages/resource/占位图.png' },
                    { id: 3, src: '/pages/resource/占位图.png' },
                    { id: 4, src: '/pages/resource/占位图.png' },
                ]
            },
            {
                id: 2,
                userid: 1,
                username: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "分类1",
                date: '2000.1.1',
                content: "内容内容内容内容内容内容内容内容",
                imgs: [
                    { id: 1, src: '/pages/resource/占位图.png' },
                    { id: 2, src: '/pages/resource/占位图.png' },
                    { id: 3, src: '/pages/resource/占位图.png' },
                    { id: 4, src: '/pages/resource/占位图.png' },
                ]
            },
            {
                id: 3,
                userid: 1,
                username: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "分类1",
                date: '2000.1.1',
                content: "内容内容内容内容内容内容内容内容",
                imgs: [
                    { id: 1, src: '/pages/resource/占位图.png' },
                    { id: 2, src: '/pages/resource/占位图.png' },
                    { id: 3, src: '/pages/resource/占位图.png' },
                    { id: 4, src: '/pages/resource/占位图.png' },
                ]
            }
        ],

        // 隐显等界面控制
        hasNotice: true,
        refreshTip: '再拉我就刷给你看',
    },

    _data: {
        search_word: '',
        tipHeight: null, // 下拉刷新提示的高度
        scrollTop: null  // 记录实时高度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 准备必要的数据
        this._data.tipHeight = unitConvert.rpx2px(60);
        // 关闭跳转时的loading提示
        wx.hideToast();
        // TODO 从文件中读取
        console.log('load')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("show")
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
        // TODO 跳转到新页面
        console.log(category);
    },

    // 点击楼主头像
    postAvatarTap: function (e) {
        // TODO 跳转到新页面
        var user = {};
        user.id = e.detail.avatar;
        user.avatar = e.detail.userid;
    },

    // 点击帖子内容
    postTap: function (e) {
        // TODO 跳转到新页面
        var post = e.detail.post;
    },

    // 底部按钮
    bottom_button: function (e) {
        // TODO 页面跳转
        switch (e.currentTarget.id) {
            case 'home':
                break;
            case 'sign':
                break;
            case 'new_post':
                break;
            case 'rank':
                break;
            case 'person':
                break;
        }
    },

    // 滚动，实现下拉刷新
    // 触发TOP就刷新，scroll的时候记录位置，touchend的时候回到原位，记录isFreshing
    onTouchEnd: function(e) {
        console.log('touch_end')
    },
    onScroll: function(e) {
        this._data;
    },
    onTop: function(e) {
        console.log('top');
    },

    /**************************************/
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})