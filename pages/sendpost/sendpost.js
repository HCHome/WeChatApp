// pages/sendpost/sendpost.js
const app = getApp();
const net4Post = require('../../utils/net4Post.js');
const currentUser = require('../../utils/currentUser.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        categoryArray: [],
        chosenCategory: null,
        chosenImgs: [],
        initValue: ''
    },

    /**
     * 后台需要保存的数据
     */
    _data: {
        title: null,
        text: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({ title: "发帖页面" })

        var tmp = []
        app.globalData.categories.forEach(item => { tmp.push(item.name) })
        this.setData({ categoryArray: tmp, chosenCategory: tmp[1] });

        this._data.title = null;
        this._data.text = null;
    },

    /**
     * 页面输入变化
     */
    cateChange: function(e) { this.setData({ chosenCategory: this.data.categoryArray[e.detail.value] }); },
    titleInput: function(e) { this._data.title = e.detail.value; },
    textInput: function(e) { this._data.text = e.detail.value; },

    /**
     * 选择图片
     */
    chooseImg: function() {
        var that = this;
        wx.chooseImage({
            count: 9 - that.data.chosenImgs.length,
            sizeType: 'compressed',
            success: function(res) {
                var imgArray = that.data.chosenImgs;
                res.tempFilePaths.forEach(item => {
                    if (!imgArray.includes(item)) imgArray.push(item);
                })
                that.setData({ chosenImgs: imgArray });
            }
        });
    },

    /**
     * 发布
     */
    onPost: function(e) {
        // 输入检查·标题
        if (this._data.title == null || this._data.title == '')
            wx.showToast({
                title: '请输入标题',
                duration: 1000,
                mask: true,
                image: '/resources/warning.png'
            });
        // 输入检查·内容
        else if (this._data.text == null || this._data.text == '')
            wx.showToast({
                title: '请输入帖子内容',
                duration: 1000,
                mask: true,
                image: '/resources/warning.png'
            });
        // 发布
        else {
            wx.showLoading({ title: '发布中...', mask: true });
            // 发帖
            var that = this;
            net4Post.sendPost({
                userId: currentUser.data.userId,
                category: that.data.chosenCategory,
                title: that._data.title,
                text: that._data.text,
                imgs: that.data.chosenImgs,
                success: res => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        mask: true,
                        duration: 1500
                    })
                    that.setData({ chosenImgs: [], initValue: ''});
                    wx.switchTab({ url: '/pages/home/home' });
                },
                fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布失败',
                        image: '/resources/warning.png',
                        mask: true,
                        duration: 1500
                    });
                }
            })
        }
    },

    /**
     * 删掉图片
     */
    deleteImg: function(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否删除此图片？',
            success: function(res) {
                if (res.confirm) {
                    var imgs = that.data.chosenImgs;
                    imgs.splice(imgs.indexOf(e.target.dataset.img), 1);
                    that.setData({ chosenImgs: imgs });
                }
            }
        })
    }
})
