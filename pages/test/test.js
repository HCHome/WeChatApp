// pages/test/test.js
const loginManager = require('../../utils/loginManager.js')
const net4Post = require('../../utils/net4Post.js')

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

        posts: [
            {
                postId: 1,
                posterId: 1,
                posterNickname: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "公告栏",
                createdDate: '2000.1.1',
                text: "内容内容内容内容内容内容内容内容",
                pictureUrl: [
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                ]
            },
            {
                postId: 2,
                posterId: 1,
                posterNickname: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "公告栏",
                createdDate: '2000.1.1',
                text: "内容内容内容内容内容内容内容内容",
                pictureUrl: [
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                ]
            },
            {
                postId: 3,
                posterId: 1,
                posterNickname: "帆会",
                avatar: '/pages/resource/占位图.png',
                title: "标题",
                category: "公告栏",
                createdDate: '2000.1.1',
                text: "内容内容内容内容内容内容内容内容",
                pictureUrl: [
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                    '/pages/resource/占位图.png',
                ]
            }
        ]
    },

    avatar: function () {
        console.log('avatar click')
    },

    onTap: function () {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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