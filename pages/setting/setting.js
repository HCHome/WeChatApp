// pages/userinfosetting/userinfosetting.js
const app = getApp();
const currentUser = require('../../utils/currentUser.js');
const net4User = require('../../utils/net4User.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        toHome: false,
        // 初始信息，变量名和WXML中的prop一致
        nickname    : null,
        isSingleDog : null,
        job         : null,
        phoneNumber : null,
        profession  : null,
        qqNumber    : null,
        school      : null,
        sex         : null,
        term        : null,
        wechatNumber: null,
        isDisplay   : null, // 保存为true or false 前端显示再转成中文
        // 选择范围
        sexRange: ['男', '女'],
        YNRange : ['是', '否'],
        termRange: [],
        // 是否处于禁用编辑状态
        disabled: true,
        btnText: '编辑'
    },

    /**
     * 同步信息到界面
     */
    syncUserInfo: function() {
        this.setData({
            isDisplay   :!!(currentUser.data.isDisplay),
            isSingleDog :!!(currentUser.data.isSingleDog),
            job         :currentUser.data.job          ? currentUser.data.job          : '',
            nickname    :currentUser.data.nickname     ? currentUser.data.nickname     : '',
            phoneNumber :currentUser.data.phoneNumber  ? currentUser.data.phoneNumber  : '',
            profession  :currentUser.data.profession   ? currentUser.data.profession   : '',
            qqNumber    :currentUser.data.qqNumber     ? currentUser.data.qqNumber     : '',
            school      :currentUser.data.school       ? currentUser.data.school       : '',
            sex         :currentUser.data.sex          ? currentUser.data.sex          : '',
            term        :currentUser.data.term         ? currentUser.data.term         : '',
            wechatNumber:currentUser.data.wechatNumber ? currentUser.data.wechatNumber : '',
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        for (var i = app.globalData.terms.start; i <= app.globalData.terms.end; i++) {
            this.data.termRange.push(i);
        }
        this.setData({ termRange: this.data.termRange });
        if (options && options.toHome) {
            this.setData({ toHome: true });
            this.btnTap();
        }
        // 获取基础信息
        this.syncUserInfo();
    },

    /**
     * 点击按钮
     */
    btnTap: function(e) {
        if (this.data.btnText == '编辑')
            this.setData({ btnText:'保存', disabled: false });
        else {
            if (this.checkInput()) {
                this.setData({ btnText:'编辑', disabled: true });
                this.saveInfo();
            }
        }
    },

    /**
     * 校验填写的数据的有效性
     */
    checkInput: function () {
        if (!this.data.sex) {
            wx.showToast({
                image: "/resources/warning.png",
                title: '请填写性别',
                duration: 1500
            });
            return false;
        } else if (!this.data.term) {
            wx.showToast({
                image: "/resources/warning.png",
                title: '请填写入会年级',
                duration: 1500
            });
            return false;
        } else {
            return true;
        }
    },

    /**
     * 编辑
     */
    onChange: function(e) {
        var value = e.detail.value;
        var prop = e.currentTarget.dataset.prop;
        var temp = {};
        if (prop == 'isSingleDog')
            temp[prop] = (value==0);
        else if (prop == 'sex')
            temp[prop] = value == 0 ? "男" : "女";
        else if (prop == 'term')
            temp[prop] = this.data.termRange[value];
        else
            temp[prop] = value;
        this.setData(temp);
    },

    /**
     * 保存信息到服务器
     */
    saveInfo: function() {
        // 显示Loading
        wx.showLoading({ title: '保存中...', mask: true });
        // 新的信息
        var reqData = {
            userId      : currentUser.data.userId,
            isDisplay   : this.data.isDisplay,
            isSingleDog : this.data.isSingleDog  == null ? this.data.isSingleDog  : this.data.isSingleDog,
            job         : this.data.job          == null ? this.data.job          : this.data.job,
            phoneNumber : this.data.phoneNumber  == null ? this.data.phoneNumber  : this.data.phoneNumber,
            profession  : this.data.profession   == null ? this.data.profession   : this.data.profession,
            qqNumber    : this.data.qqNumber     == null ? this.data.qqNumber     : this.data.qqNumber,
            school      : this.data.school       == null ? this.data.school       : this.data.school,
            sex         : this.data.sex          == null ? this.data.sex          : this.data.sex,
            term        : this.data.term         == null ? this.data.term         : this.data.term,
            wechatNumber: this.data.wechatNumber == null ? this.data.wechatNumber : this.data.wechatNumber
        }
        // 回调函数
        var that = this;
        var reqCB = {
            success: res => {
                wx.hideLoading();
                if (res.data.status == 10001) {
                    // 更新后台保存的数据
                    currentUser.renewHCInfo(reqData);
                    // 页面数据更新
                    that.setData(reqData);
                    wx.showToast({
                        title: '保存成功',
                        mask: true,
                        duration: 2000
                    });
                    if (that.data.toHome) wx.switchTab({ url: '/pages/home/home' });
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({
                    title: '保存失败',
                    mask: true,
                    duration: 2000
                });
            }
        }
        // 发起请求
        var reqObj = reqData;
        reqObj.success = reqCB.success;
        reqObj.fail = reqCB.fail;
        net4User.modifyUserInfo(reqObj);
    }
})
