// pages/person/person.js
const currentUser = require('../../utils/currentUser.js');
const net4User = require('../../utils/net4User.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        letter: '?',
        avatar: '',
        nickName: '',
        gender_img: '',
        unReadCount: 0,
        showAuth: false
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
        if (currentUser.data.sex)
            gender_img = currentUser.data.sex == "男" ? "../../resources/male.png" : "../../resources/female.png";
        this.setData({
            letter     : currentUser.data.nickname[currentUser.data.nickname.length - 1],
            avatar     : currentUser.data.avatar,
            nickName   : currentUser.data.nickname,
            gender_img : gender_img,
            unReadCount: currentUser.data.unReadCount,
            showAuth   : !currentUser.data.avatar
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getUserInfo();
    },

    /**
     * 打开授权设置页面
     */
    onOpenSetting: function(e) {
        console.log(e.detail.authSetting)
        if (e.detail.authSetting["scope.userInfo"]) {
            this.setData({
                showAuth: false
            });
            wx.showToast({
                title: "下次登录刷新头像",
                duration: 2000
            });
        }
    },

    /**
     * 从服务器获取用户信息
     */
    getUserInfo: function() {
        wx.showLoading({ title: "正在获取信息...", mask: true });
        var that = this;
        net4User.getUserInfo({
            userId: currentUser.data.userId,
            success: res => {
                // 性别的图
                var gender_img = "";
                if (currentUser.data.sex)
                    gender_img = currentUser.data.sex == "男" ? "../../resources/male.png" : "../../resources/female.png";
                // 同步信息到页面
                that.setData({
                    letter    : currentUser.data.nickname[currentUser.data.nickname.length - 1],
                    avatar    : currentUser.data.avatar,
                    nickName  : currentUser.data.nickname,
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
    toMsg: function(e) {
        currentUser.renewHCInfo({ unReadCount: 0 });
        wx.navigateTo({ url: '/pages/replyList/replyList' });
    },

    /**
     * 跳转到我的帖子页面
     */
    toMyPosts: function(e) { wx.navigateTo({ url: '/pages/postHistory/postHistory'}); },

    /**
     * 跳转到个人信息修改页面
     */
    infoModify: function(e) { wx.navigateTo({ url: '/pages/setting/setting' }); },


})
