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
        viewOrder: '倒序查看',

        // 评论列表
        replyList: [],

        // 提示
        tip: "加载更多",

        // 输入框
        repliedFloorTip: '回复楼主',
        replyValue: '',
        replyInputFocus: false
    },

    /**
     * 后台使用的数据
     */
    _data: {
        // 防止重复
        replyIdList: [],
        // 回复楼层的信息
        replyText: '',
        repliedReply: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var post = JSON.parse(options.post);
        this.setData({
            post: post,
            letter: post.posterNickname[post.posterNickname.length - 1]
        });
        this.getReply();
    },

    /**
     * 页面函数绑定
     */

    // 回复楼主的按钮
    replyPoster: function(e) {
        this.setRepliedFloor(null);
        this.setData({ replyInputFocus: true });
    },

    // 改变排序
    changeOrder: function(e) {
        if (this.data.viewOrder == '正序查看')
            this.sortReply('倒序查看');
        else
            this.sortReply('正序查看');
    },

    /**
     * 点击楼主
     */
    onPosterTap: function(e) {
        wx.navigateTo({ url: "/pages/userDetail/userDetail?userId=" + this.data.posterId });
    },

    // 针对回复的操作菜单
    onMenu: function(e) {
        // 判断权限：楼主or回复发布者
        var targetReply = e.detail.reply;
        if (targetReply) {
            if (currentUser.data.userId == this.data.posterId || currentUser.data.userId == targetReply.replierId) {
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
        }
    },

    // 点击头像
    avatarTap: function(e) {
        console.log(e)
    },

    // 点击确定按钮
    confirmReply: function(e) {
        this._data.replyText = e.detail.value;
        if (this._data.replyText == "")
            wx.showToast({
                title: '请输入回复',
                duration: 1000,
                mask: true,
                image: '/resources/warning.png'
            });
        else
            this.postReply();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getReply();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.tip == '加载更多') {
            var lastID = 0;
            if (this.data.replyList.length > 0) lastID = this.data.replyList[this.data.replyList.length - 1].replyId;
            this.getReply(lastID);
        }
    },

    /**
     * 后台调用函数
     */
    // 获取回复
    getReply: function(lastID) {
        this.setData({ tip: '正在加载' });
        wx.showNavigationBarLoading();
        var that = this;
        net4Post.getReply({
            lastReplyId: lastID ? lastID : 0,
            postId: this.data.post.postId,
            success: res => {
                if (res.status == 10001) {
                    var replies = that.data.replyList;
                    for (var i = 0; i < res.replyList.length; i++)
                        if (!that._data.replyIdList.includes(res.replyList[i].replyId)) {
                            that._data.replyIdList.push(res.replyList[i].replyId);
                            // 修改一下日期格式
                            var date = new Date(res.replyList[i].createdDate);
                            res.replyList[i].createdDate = date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
                            // 头像设置
                            if (res.replyList[i].replierAvatar == '')
                                res.replyList[i].letter = res.replyList[i].replierNickname[res.replyList[i].replierNickname.length - 1];
                            replies.push(res.replyList[i]);
                        }
                    that.setData({ replyList: replies });
                    that.sortReply();
                }
            },
            complete: () => {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                if (that.data.tip == '正在加载') {
                    that.setData({ tip: '暂无更多回复' });
                    setTimeout(() => { that.setData({ tip: '加载更多' }); }, 5000);
                }
            }
        })
    },

    // 删除回复
    deleteReply: function(reply) {
        var that = this;
        net4Post.deleteReply({
            replyId: reply.replyId,
            success: res => {
                if (res.data.status == 10001) {
                    // 删除ID列表
                    that._data.replyIdList.splice(that._data.replyIdList.indexOf(reply.replyId), 1);
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
    },

    // 设置回复楼层
    setRepliedFloor: function(repliedReply) {
        this._data.repliedReply = repliedReply;
        if (repliedReply == null) this.setData({ repliedFloorTip: '回复楼主' });
        else this.setData({ repliedFloorTip: '回复#' + repliedReply.floor });
    },

    // 发送回复
    postReply: function() {
        var that = this;
        wx.showLoading({
            title: '发布中...',
            mask: true
        });
        net4Post.postReply({
            userId: currentUser.data.userId,
            postId: this.data.post.postId,
            repliedFloor: this._data.repliedReply ? this._data.repliedReply.floor : 0,
            repliedFloorUserId: this._data.repliedReply ? this._data.repliedReply.replierId : this.data.posterId,
            posterId: this.data.post.posterId,
            text: this._data.replyText,
            success: res => {
                if (res.data.status != 10001)
                    this.fail();
                else {
                    wx.hideLoading();
                    console.log({
                        userId: currentUser.data.userId,
                        postId: this.data.post.postId,
                        repliedFloor: this._data.repliedReply ? this._data.repliedReply.floor : 0,
                        repliedFloorUserId: this._data.repliedReply ? this._data.repliedReply.replierId : this.data.posterId,
                        posterId: this.data.post.posterId,
                        text: this._data.replyText,
                    })
                    console.log(res)

                    wx.showToast({
                        title: '发布成功',
                        icon: "success",
                        duration: 1500
                    });
                    that.getReply(that.data.replyList.length > 0 ? that.data.replyList[that.data.replyList.length - 1].replyId : 0);
                    that.setData({ replyValue: '' }); // 清空输入框
                    that.setRepliedFloor(null);
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({
                    title: '发布失败',
                    image: '/resources/warning.png',
                    duration: 1500
                });
            },
        })
    },

    // 输入回复
    replyInput: function(e) { this._data.replyText = e.detail.value; },

    // 给回复排序，注意会设定界面显示的字，所以调用之前不需要先设定
    sortReply: function(viewOrder) {
        if (!viewOrder) var viewOrder = this.data.viewOrder;
        if (viewOrder == '正序查看') { var sortFun = (a, b) => (b.floor - a.floor); } else { var sortFun = (a, b) => (a.floor - b.floor); }
        var replies = this.data.replyList;
        replies.sort(sortFun);
        this.setData({ replyList: null });
        this.setData({ viewOrder: viewOrder, replyList: replies });
    }
})
