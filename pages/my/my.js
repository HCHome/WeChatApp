// pages/person/person.js
const loginManager = require('../../../utils/loginManager.js');
const net4Post = require('../../../utils/net4Post.js');
const net4User = require('../../../utils/net4User.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        letter: '?',
        avatar: '',
        nickName: '',
        gender_img: '',
        unReadCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var gender_img = "";
        if (loginManager.hc_info.user.sex)
            gender_img = loginManager.hc_info.user.sex == "男" ? "../../resources/male.png" : "../../resources/female.png";
        this.setData({
            letter     : loginManager.hc_info.user.letter,
            avatar     : loginManager.hc_info.user.avatar,
            nickName   : loginManager.hc_info.user.nickname,
            gender_img : gender_img,
            unReadCount: loginManager.hc_info.user.unReadCount
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getUserInfo();
    },

    /**
     * 从服务器获取用户信息
     */
    getUserInfo: function() {
        wx.showLoading({ title: "正在获取信息...", mask: true });
        var that = this;
        net4User.getUserInfo({
            userId: loginManager.hc_info.user.userId,
            success: res => {
                // 性别的图
                var gender_img = "";
                if (loginManager.hc_info.user.sex)
                    gender_img = loginManager.hc_info.user.sex == "男" ? "../../resources/male.png" : "../../resources/female.png";
                // 同步信息到页面
                that.setData({
                    letter    : loginManager.hc_info.user.letter,
                    avatar    : loginManager.hc_info.user.avatar,
                    nickName  : loginManager.hc_info.user.nickname,
                    gender_img: gender_img
                });
                // 关闭提示
                wx.hideLoading();
            }
        });
    },

    /**
     * 跳转到收到的回复页面
     */
    toMsg: function(e) { wx.navigateTo({ url: '/pages/my/receivemsg/receivemsg' }); },

    /**
     * 跳转到我的帖子页面
     */
    toMyPosts: function(e) { wx.navigateTo({ url: '/pages/my/myposts/myposts'}); },

    /**
     * 跳转到个人信息修改页面
     */
    infoModify: function(e) { wx.navigateTo({ url: '/pages/my/userinfosetting/userinfosetting' }); },


})
