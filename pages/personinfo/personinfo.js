// pages/personinfo/personinfo.js
var net4User = require("../../utils/net4User.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: null,
        nickname: null,
        infos: [
        /**
         * {
         *    key: "asd",
         *    value: "asdd"
         * }
         */
        ]
    },

    _data: {
        id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var user = JSON.parse(options.user);
        this.setData({ avatar: user.avatar });
        this._data.id = user.id;
        this.getUserInfo();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 请求用户信息并填充
     */
    getUserInfo: function() {
        wx.showLoading({
            title: "正在获取信息...",
            mask: true
        });
        if (this._data.id == 0) {
            wx.hideLoading();
            wx.showToast({
                title: "获取失败！",
                image: "/pages/resources/warning.png",
                duration: 1000,
                complete: function() { wx.navigateBack({ delta: 1 }); }
            });
            return;
        }
        var that = this;
        net4User.getUserInfo({
            userId: that._data.id,
            success: res => {
                wx.hideLoading();
                console.log(res);
                var user = res.data.data.user;
                var infos = [];
                infos.push({ key: "姓名", value: user.nickname });
                infos.push({ key: "性别", value: user.sex });

                if (user.isDisplay) {
                    infos.push({ key: "学校",     value: user.school      });
                    infos.push({ key: "年级",     value: user.term        });
                    infos.push({ key: "专业",     value: user.profession  });
                    infos.push({ key: "是否单身", value: user.isSingleDog == null ? "" : (user.isSingleDog ? "是" : "否") });
                    infos.push({ key: "工作",     value: user.job         });
                    infos.push({ key: "联系方式", value: user.phoneNumber });
                    infos.push({ key: "QQ号码",   value: user.qqNumber    });
                    infos.push({ key: "微信",     value: user.wechatNumber});
                } else {
                    infos.push({ key: "", value: "因用户设置，其他信息不显示" });
                }

                that.setData({ nickname: user.nickname, infos: infos });
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({
                    title: "获取失败！",
                    image: "/pages/resources/warning.png",
                    duration: 1000,
                    complete: function() { wx.navigateBack({ delta: 1 }); }
                });
            }
        })
    }
})
