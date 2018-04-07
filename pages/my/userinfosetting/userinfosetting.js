// pages/userinfosetting/userinfosetting.js
const loginManager = require('../../../utils/loginManager.js');
const net4User = require('../../../utils/net4User.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 初始信息
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
        isDisplay   : null,
        // 选择范围
        sexRange: ['男', '女'],
        YNRange : ['是', '否'],
        // 是否处于禁用编辑状态
        disabled: true,
        btnText: '编辑'
    },

    /**
     * 同步信息到界面
     */
    syncUserInfo: function() {
        console.log(loginManager.hc_info.user)
        this.setData({
            isDisplay   :loginManager.hc_info.user.isDisplay,
            isSingleDog :loginManager.hc_info.user.isSingleDog,
            job         :loginManager.hc_info.user.job          ? loginManager.hc_info.user.job          : '',
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
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
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
            this.setData({ btnText:'编辑', disabled: true });
            this.saveInfo();
        }
    },

    /**
     * 编辑
     */
    onChange: function(e) {
        var value = e.detail.value;
        var prop = e.currentTarget.dataset.prop;
        console.log(value)
        console.log(prop)
        var temp = {};
        if (prop == 'isSingleDog')
            temp[prop] = (value==0);
        else if (prop == 'sex')
            temp[prop] = value == 0 ? "男" : "女";
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
            userId      : loginManager.hc_info.user.userId,
            isDisplay   : this.data.isDisplay    == null ? this.data.isDisplay    : this.data.isDisplay,
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
    }
})
