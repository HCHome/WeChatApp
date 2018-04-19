//index.js
//获取应用实例
const app = getApp()
const net4User = require('../../utils/net4User.js')

Page({
    data: {
        msg_length: 0,
        msg: null,
        name: null,
        yearArray: ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011',
            '2012', '2013', '2014', '2015冬', '2015夏', '2016', '2017', '2018'],
        index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
    },

    /**
     * 绑定页面元素
     */

    // 输入
    picker_change: function (e) { this.setData({ index: e.detail.value }) },
    msg_input: function (e) { this.setData({ msg: e.detail.value, msg_length: e.detail.value.length }); },
    name_input: function (e) { this.setData({ name: e.detail.value }) },

    // 提交
    confirm: function () {
        // 检测输入
        if (!this.data.name)
            wx.showToast({
                title: '请输入姓名',
                image: '/resources/warning.png',
                duration: 1000
            });
        else if (!this.data.msg)
            wx.showToast({
                title: '留言不能为空',
                image: '/resources/warning.png',
                duration: 1000
            });
        // 输入没有问题，进行提交
        else {
            wx.showLoading({ title: '正在提交', mask: true });
            var that = this;
            net4User.apply_hc({
                term: that.term(),
                name: that.data.name,
                message: that.data.msg,
                success: res => {
                    wx.hideLoading();
                    if (res.data.status == '10001') {
                        wx.showToast({
                            title: '提交成功！',
                            icon: 'success',
                            duration: 3000
                        });

                        // 给login页面传入正在申请中的信息
                        var pages = getCurrentPages();
                        var currPage = pages[pages.length - 1];   //当前页面
                        var prevPage = pages[pages.length - 2];  //上一个页面

                        //直接调用上一个页面的函数，告知applying
                        prevPage.setApply(res.data);
                        // 返回
                        setTimeout(() => { wx.navigateBack({ delta: 1 }); }, 3000);
                    } else this.fail();
                },
                fail: () => {
                    wx.showToast({
                        title: '发生异常，请重试',
                        image: '/resources/warning.png',
                        duration: 3000,
                        mask: true
                    });
                    wx.navigateBack({ delta: 1 });
                }
            });
        }
    },

    /**
     * 后台调用函数
     */
    term: function () {
        if (this.data.yearArray[this.data.index].includes('冬'))
            return 2014;
        else if (this.data.yearArray[this.data.index].includes('夏'))
            return 2015;
        else
            return parseInt(this.data.yearArray[this.data.index]);
    }
})
