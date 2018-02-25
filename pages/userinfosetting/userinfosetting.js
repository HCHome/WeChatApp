// pages/userinfosetting/userinfosetting.js
const loginManager = require('../../utils/loginManager.js');
const net4User = require('../../utils/net4User.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 头像
        letter: '?',
        avatar: '',
        // 初始信息
        nickname    : null,
        isSingle    : null,
        job         : null,
        phoneNumber : null,
        profession  : null,
        qqNumber    : null,
        school      : null,
        sex         : null,
        term        : null,
        wechatNumber: null,
        isDisplay   : null,
        // 选择范围
        sexRange: ['男', '女'],
        YNRange : ['是', '否'],
        // 是否处于禁用编辑状态
        disabled: true,
        btnText: '编辑'
    },

    /**
     * 后台使用的数据
     */
    _data: {
        // 各属性实时输入的数值
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
        is_display  : null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({ title: '获取信息中...' });
        this.getUserInfo();
    },

    /**
     * 获取用户信息
     */
    getUserInfo: function() {
        var that = this;
        net4User.getUserInfo({
            userId: loginManager.hc_info.user.userId,
            success: res => {
                var user = res.data.data.user;
                // 把新增的信息放进loginManager
                loginManager.setHC_info(user);

                // 更新页面
                that.setData({
                    hasGender: !!(user.sex),
                    gender_img: (user.sex && user.sex == '男') ? '../resource/male.png' : '../resource/female.png',
                    job: user.job
                })

                // 关闭提示
                wx.hideLoading();
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 获取基础信息
        this.setData({
            avatar      :loginManager.hc_info.user.avatar,
            isDisplay   :loginManager.hc_info.user.isDisplay ? '是' : '否',
            isSingleDog :loginManager.hc_info.user.isSingleDog ? '是' : '否',
            job         :loginManager.hc_info.user.job          ? loginManager.hc_info.user.job          : '',
            letter      :loginManager.hc_info.user.letter       ? loginManager.hc_info.user.letter       : '',
            nickname    :loginManager.hc_info.user.nickname     ? loginManager.hc_info.user.nickname     : '',
            phoneNumber :loginManager.hc_info.user.phoneNumber  ? loginManager.hc_info.user.phoneNumber  : '',
            profession  :loginManager.hc_info.user.profession   ? loginManager.hc_info.user.profession   : '',
            qqNumber    :loginManager.hc_info.user.qqNumber     ? loginManager.hc_info.user.qqNumber     : '',
            school      :loginManager.hc_info.user.school       ? loginManager.hc_info.user.school       : '',
            sex         :loginManager.hc_info.user.sex          ? loginManager.hc_info.user.sex          : '',
            term        :loginManager.hc_info.user.term         ? loginManager.hc_info.user.term         : '',
            wechatNumber:loginManager.hc_info.user.wechatNumber ? loginManager.hc_info.user.wechatNumber : '',
        });
    },

    /**
     * 点击按钮
     */
    btnTap: function(e) {
        if (this.data.btnText == '编辑')
            this.setData({ btnText:'保存', disabled: false });
        else {
            this.setData({ btnText:'编辑', disabled: true });
            this.saveInfo();
        }
    },

    /**
     * 编辑
     */
    onChange: function(e) {
        this._data[e.currentTarget.dataset.prop] = e.detail.value;
    },

    /**
     * 保存信息到服务器
     */
    saveInfo: function() {
        // 显示Loading
        wx.showLoading({ title: '保存中...', mask: true });
        // 新的信息
        var reqData = {
            userId      : loginManager.hc_info.user.userId,
            isDisplay   : this._data.isDisplay    == null ? this.data.isDisplay    : this._data.isDisplay,
            isSingleDog : this._data.isSingleDog  == null ? this.data.isSingleDog  : this._data.isSingleDog,
            job         : this._data.job          == null ? this.data.job          : this._data.job,
            phoneNumber : this._data.phoneNumber  == null ? this.data.phoneNumber  : this._data.phoneNumber,
            profession  : this._data.profession   == null ? this.data.profession   : this._data.profession,
            qqNumber    : this._data.qqNumber     == null ? this.data.qqNumber     : this._data.qqNumber,
            school      : this._data.school       == null ? this.data.school       : this._data.school,
            sex         : this._data.sex          == null ? this.data.sex          : this._data.sex,
            term        : this._data.term         == null ? this.data.term         : this._data.term,
            wechatNumber: this._data.wechatNumber == null ? this.data.wechatNumber : this._data.wechatNumber
        }
        // 回调函数
        var that = this;
        var reqCB = {
            success: res => {
                wx.hideLoading();
                if (res.data.status == 10001) {
                    // 更新后台保存的数据
                    loginManager.setHC_info(reqData);
                    // 页面数据更新
                    that.setData(reqData);
                    wx.showToast({
                        title: '保存成功',
                        mask: true,
                        duration: 2000
                    });
                }
            },
            fail: () => {
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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
