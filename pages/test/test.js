// pages/test/test.js
const loginManager = require('../../utils/loginManager.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg: '',
        post: {
            username: "骨天乐",
            avatar: '../../pages/resource/占位图.png',
            title: "麻痹戒指",
            category: "潮友日常",
            date: '2017.2.2',
            content: "是兄弟，就来糖丸蓝月",
            imgs: [
                { id: 1, src: '../../pages/resource/占位图.png' },
                { id: 2, src: '../../pages/resource/占位图.png' },
                { id: 3, src: '../../pages/resource/占位图.png' },
                { id: 4, src: '../../pages/resource/占位图.png' }
            ],
        }
    },

    avatar: function() {
        console.log('avatar click')
    },

    onTap: function() {
        console.log('tap')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { },

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