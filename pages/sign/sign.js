// pages/sign/sign.js
const app = getApp();
const currentUser = require('../../utils/currentUser.js');
const net4User = require('../../utils/net4User.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        signScore: 0,
        letter: null,
        imgUrl: null,
        order: null,
        scoreRankList: [],
        btnDisabled: false,
        buttonText: '签到'
    },

    /**
     * 页面后台的数据
     */

    _data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({ title: '获取数据中' });
        if (currentUser.data.isSign) {
            var buttonText = '今日已签到';
            var btnDisabled = true;
        } else {
            var buttonText = '签到';
            var btnDisabled = false;
        }
        if (currentUser.data.avatar) this.setData({
            imgUrl: currentUser.data.avatar,
            signScore: currentUser.data.signScore,
            signButtonShow: currentUser.data.isSign,
            buttonText: buttonText,
            btnDisabled: btnDisabled
        });
        else this.setData({
            letter: currentUser.data.nickname[currentUser.data.nickname.length - 1],
            signScore: currentUser.data.signScore,
            signButtonShow: currentUser.data.isSign,
            buttonText: buttonText,
            btnDisabled: btnDisabled
        });

        this.renewRank();
    },

    /**
     *  更新排行列表
     */
    renewRank: function() {
        var that = this;
        net4User.signRank({
            userId: currentUser.data.userId,
            success: res => {
                // 关闭loading提示
                wx.hideLoading();
                if (res.data.status == 10001) {
                    // 列表
                    res.data.data.scoreRankList.forEach(item => {
                        item.letter = item.nickname[item.nickname.length - 1];
                    });
                    // 当前用户排名
                    currentUser.data.signScore = res.data.data.userScoreRank.signScore;
                    that.setData({
                        scoreRankList: res.data.data.scoreRankList,
                        order: res.data.data.userScoreRank.scoreRank,
                        signScore: res.data.data.userScoreRank.signScore
                    });
                } else if (res.data.status == 10002) {
                    wx.showToast({
                        title: '服务器异常，请稍后重试！',
                        duration: 1500
                    })
                }
            }
        });
    },

    /**
     * 签到按钮绑定
     */
    signBtn: function(e) {
        if (!this.data.btnDisabled) {
            wx.showLoading({ title: '签到中...' });
            net4User.sign({
                userId: currentUser.data.userId,
                success: res => {
                    wx.hideLoading();
                    if (res.data.status == 10001) {
                        this.renewRank();
                        wx.showToast({
                            title: '签到成功',
                            duration: 1500
                        });
                        this.setData({
                            btnDisabled: true,
                            buttonText: '今日已签到'
                        });
                    } else wx.showToast({
                        title: '签到失败',
                        image: '/resources/warning.png',
                        duration: 1500
                    });
                }
            })
        }
    },

    /**
     * 点击潮友跳转
     */
    onUserTap: function(e) {
        wx.navigateTo({
            url: '/pages/userDetail/userDetail?userId='+ e.currentTarget.dataset.id
        });
    }
})
