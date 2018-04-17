// pages/sign/sign.js
const app = getApp();
const loginManager = require('../../utils/loginManager.js');
const net4User = require('../../utils/net4User.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        signScore: 30,
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
        if (loginManager.hc_info.user.isSign) {
            var buttonText = '今日已签到';
            var btnDisabled = true;
        } else {
            var buttonText = '签到';
            var btnDisabled = false;
        }
        if (loginManager.hc_info.user.avatar) this.setData({
            imgUrl: loginManager.hc_info.user.avatar,
            signScore: loginManager.hc_info.user.signScore,
            signButtonShow: loginManager.hc_info.user.isSign,
            buttonText: buttonText,
            btnDisabled: btnDisabled
        });
        else this.setData({
            letter: loginManager.hc_info.user.letter,
            signScore: loginManager.hc_info.user.signScore,
            signButtonShow: loginManager.hc_info.user.isSign,
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
            userId: loginManager.hc_info.user.userId,
            success: res => {
                // 列表
                res.data.data.scoreRankList.forEach(item => {
                    if (!item.avatar) item.letter = item.nickname[item.nickname.length - 1];
                });
                // 当前用户排名
                loginManager.hc_info.user.signScore = res.data.data.userScoreRank.signScore;
                that.setData({
                    scoreRankList: res.data.data.scoreRankList,
                    order: res.data.data.userScoreRank.scoreRank,
                    signScore: res.data.data.userScoreRank.signScore
                });
                // 关闭loading提示
                wx.hideLoading();
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
                userId: loginManager.hc_info.user.userId,
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
                        image: '/pages/resources/warning.png',
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
            url: '/pages/personinfo/personinfo?userId='+ e.currentTarget.dataset.id
        });
    }
})
