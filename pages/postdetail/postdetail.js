// pages/postDetail/postDetail.js
const app = getApp();
var net4Post = require("../../utils/net4Post.js");
var currentUser = require("../../utils/currentUser.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 帖子本体
        post: null,
        letter: null,
        updatedDate: null,

        // 评论列表
        replyList: [],

        // 底部提示
        tip: "加载更多",

        // 输入框
        repliedFloorTip: '回复楼主',
        replyValue: '',
        replyInputFocus: false,

        // 排序按钮
        orderBtn: null
    },

    /**
     * 后台使用的数据
     */
    _data: {
        // 是否从“收到的回复页面”过来
        startReplyId: null,

        // 切换到排序的对应代码，这样要改页面文字不用改很多
        switchToOldest: "切换到正序",
        switchToLastest: "切换到逆序",

        // 回复楼层的信息
        replyText: '',
        repliedReply: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var post = JSON.parse(options.post);
        var that = this;
        this.setData({
            post: post,
            letter: post.posterNickname[post.posterNickname.length - 1],
            orderBtn: that._data.switchToOldest
        });
        this._data.startReplyId = options.replyId;
        this.getReply();
    },

    /**
     * 获取所有回复并进行排序
     */
    getReply: function() {
        this.setData({ tip: '正在加载' });
        wx.showNavigationBarLoading();

        var that = this;
        var net = lastId => {
            net4Post.getReply({
                lastReplyId: lastId,
                postId: that.data.post.postId,
                success: res => {
                    if (res.status != 10001 || res.replyList.length == 0) {
                        if (that.data.orderBtn == that._data.switchToOldest) {
                            var sortFun = (a, b) => (b.floor - a.floor);
                        } else {
                            var sortFun = (a, b) => (a.floor - b.floor);
                        }
                        that.data.replyList.sort(sortFun);
                        that.setData({ replyList: that.data.replyList });

                        wx.hideNavigationBarLoading();
                        wx.stopPullDownRefresh();
                        that.setData({ tip: "暂无更多回复" });
                        if (that._data.startReplyId)
                            that.scroll();
                        return;
                    }

                    res.replyList.forEach(item => { that.data.replyList.push(item) });
                    net(that.data.replyList[that.data.replyList.length - 1].replyId);
                },
                fail: () => {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                    this.setData({ tip: "暂无更多回复" });
                }
            });
        }
        net(0);
    },

    /**
     * 滚动到点进来的回复在的位置
     */
    scroll: function() {
        var query = wx.createSelectorQuery()
        query.select('#reply' + this._data.startReplyId).boundingClientRect();
        query.exec(res => {
            console.log(res)

            wx.pageScrollTo({
                scrollTop: res[0].top + wx.getSystemInfoSync().windowHeight / 2
            })
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.data.replyList = [];
        this.getReply();
    },

    /**
     * 页面响应--切换排序
     */
    switchSort: function(e) {
        if (this.data.orderBtn == this._data.switchToLastest) {
            this.setData({ orderBtn: this._data.switchToOldest })
            var sortFun = (a, b) => (b.floor - a.floor);
        } else {
            this.setData({ orderBtn: this._data.switchToLastest })
            var sortFun = (a, b) => (a.floor - b.floor);
        }
        this.data.replyList.sort(sortFun);
        this.setData({ replyList: this.data.replyList });
    },


    /**
     * 页面响应--点击发帖者信息
     */
    onPosterTap: function(e) {
        wx.navigateTo({
            url: "/pages/userDetail/userDetail?userId=" + this.data.posterId
        });
    },

    /**
     * 页面响应--点击回复楼主
     */
    onReplyPoster: function(e) {
        this.setRepliedFloor(null);
        this.setData({ replyInputFocus: true });
    },

    /**
     * 页面响应--输入回复
     */
    replyInput: function(e) { this._data.replyText = e.detail.value; },

    /**
     * 页面响应--点击键盘确定按钮
     */
    confirmReply: function(e) {
        this._data.replyText = e.detail.value;
        if (this._data.replyText == "") {
            wx.showToast({
                title: '请输入回复',
                duration: 1000,
                mask: true,
                image: '/resources/warning.png'
            });
        } else {
            wx.showLoading({
                title: "正在发送...",
                mask: true
            });
            var that = this;
            var req = {
                userId: currentUser.data.userId,
                postId: that.data.post.postId,
                posterId: that.data.post.posterId,
                text: that._data.replyText,
                success: res => {
                    if (res.data.status == 10001) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '回复成功',
                            duration: 1000,
                            mask: true,
                            icon: "success"
                        });
                        that.setData({
                            repliedFloorTip: '回复楼主',
                            replyValue: ''
                        });
                        that.onPullDownRefresh();
                    } else {
                        req.fail();
                    }
                },
                fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '回复失败，请重试',
                        duration: 1000,
                        mask: true,
                        image: '/resources/warning.png'
                    });
                }
            }
            if (this._data.repliedReply) {
                req.repliedFloor = this._data.repliedReply.floor;
                req.repliedFloorUserId = this._data.repliedReply.replierId;
            }
            net4Post.postReply(req);
        }
    },

    /**
     * 页面响应--点击回复
     */
    onMenu: function(e) {
        var targetReply = e.detail.reply;
        if (currentUser.data.userId == this.data.posterId ||
            currentUser.data.userId == targetReply.replierId) {
            var that = this;
            wx.showActionSheet({
                itemList: ['回复', '删除'],
                success: res => {
                    if (res.tapIndex == 0) {
                        this.setRepliedFloor(targetReply);
                        this.setData({ replyInputFocus: true });
                    } else if (res.tapIndex == 1) this.deleteReply(targetReply);
                }
            });
        } else {
            this.setRepliedFloor(targetReply);
            this.setData({ replyInputFocus: true });
        }
    },

    /**
     * 设置回复楼层
     */
    setRepliedFloor: function(repliedReply) {
        this._data.repliedReply = repliedReply;
        if (repliedReply == null)
            this.setData({ repliedFloorTip: '回复楼主' });
        else
            this.setData({ repliedFloorTip: '回复#' + repliedReply.floor });
    },

    /**
     * 删除回复
     */
    deleteReply: function(reply) {
        var that = this;
        net4Post.deleteReply({
            replyId: reply.replyId,
            success: res => {
                if (res.data.status == 10001) {
                    // 删除显示的回复列表
                    var i = 0;
                    while (that.data.replyList[i].replyId != reply.replyId) { i++; }
                    var replyList = that.data.replyList;
                    replyList.splice(i, 1);
                    that.setData({ replyList: replyList });
                    that.sortReply();
                    // 弹窗提示
                    wx.showToast({
                        title: '已删除',
                        icon: 'success',
                        mask: true,
                        duration: 1500
                    });
                }
            },
            fail: () => {
                // 弹窗提示
                wx.showToast({
                    title: '删除失败',
                    image: '/resources/warning.png',
                    mask: true,
                    duration: 1500
                });
            }
        });
    }
})
