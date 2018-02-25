// pages/postdetail/postdetail.js
const app = getApp();
const net4Reply = require('../../utils/net4Reply.js');
const loginManager = require('../../utils/loginManager.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 发布者信息
        category: null,
        createdDate: null,
        letter: null,
        pictureCount: null,
        pictureUrl: null,
        postId: null,
        posterAvatar: null,
        posterId: null,
        posterNickname: null,
        repliesCount: null,
        text: null,
        title: null,
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
            category: post.category,
            createdDate: post.createdDate,
            letter: post.letter ? post.letter : null,
            pictureCount: post.pictureCount,
            pictureUrl: post.pictureUrl,
            postId: post.postId,
            posterAvatar: post.posterAvatar,
            posterId: post.posterId,
            posterNickname: post.posterNickname,
            repliesCount: post.repliesCount,
            text: post.text,
            title: post.title,
            updatedDate: post.updatedDate
        });
        this.getReply();
    },

    /**
     * 页面函数绑定
     */

    // 点击图片
    imgTap: function(e) {
        wx.previewImage({
            current: e.target.dataset.img,
            urls: this.data.pictureUrl
        });
    },

    // 回复楼主的按钮
    replyPoster: function(e) { this.setRepliedFloor(null); },

    // 改变排序
    changeOrder: function(e) {
        var replies = this.data.replyList;
        this.setData({replyList: null});
        if (this.data.viewOrder == '倒序查看') {
            replies.sort((a, b) => { return a.floor < b.floor; });
            this.setData({ viewOrder: '正序查看', replyList: replies });
        } else {
            replies.sort((a, b) => { return a.floor > b.floor; });
            this.setData({ viewOrder: '倒序查看', replyList: replies });
        }
    },

    // 针对回复的操作菜单
    onMenu: function(e) {
        // 判断权限：楼主or回复发布者
        var targetReply = e.detail.reply;
        if (targetReply) {
            if (loginManager.hc_info.user.userId == this.data.posterId || loginManager.hc_info.user.userId == targetReply.replierId) {
                var that = this;
                wx.showActionSheet({
                    itemList: ['回复', '删除'],
                    success: res => {
                        if (res.tapIndex == 0) this.setRepliedFloor(targetReply);
                        else if (res.tapIndex == 1) this.deleteReply(targetReply);
                    }
                });
            } else this.setRepliedFloor(targetReply)
        }
    },

    // 点击头像
    avatarTap: function(e) {
        console.log(e)
    },

    // 点击确定按钮
    confirmReply: function(e) {
        this._data.replyText = e.detail.value;
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
        if (this.data.tip == '加载更多')
            this.getReply(this.data.replyList[this.data.replyList.length - 1].replyId);
    },

    /**
     * 后台调用函数
     */
    // 获取回复
    getReply: function(lastID) {
        this.setData({ tip: '正在加载' });
        wx.showNavigationBarLoading();
        var that = this;
        net4Reply.getReply({
            lastReplyId: lastID ? lastID : 0,
            postId: this.data.postId,
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
                    replies.sort((a, b) => { return a.floor > b.floor; });
                    that.setData({ replyList: replies });
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
        net4Reply.deleteReply({
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
                    image: '../resource/warning.png',
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
        this.setData({ replyInputFocus: true });
    },

    // 回复
    postReply: function() {
        var that = this;
        wx.showLoading({
            title: '发布中...',
            mask: true
        });
        net4Reply.postReply({
            userId: loginManager.hc_info.user.userId,
            postId: this.data.postId,
            repliedFloor: this._data.repliedReply ? this._data.repliedReply.floor : 0,
            repliedFloorUserId: this._data.repliedReply ? this._data.repliedReply.replierId : this.data.posterId,
            posterId: this.data.posterId,
            text: this._data.replyText,
            success: res => {
                wx.hideLoading();
                wx.showToast({
                    title: '发布成功',
                    icon: "success",
                    duration: 1500
                });
                that.getReply(that.data.replyList.length > 0 ? that.data.replyList[that.data.replyList.length - 1].replyId : 0);
                that.setData({ replyValue: '' });
                that.setRepliedFloor(null);
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({
                    title: '发布失败',
                    image: '../resource/warning.png',
                    duration: 1500
                });
            },
        })
    },

    // 输入回复
    replyInput: function(e) { this._data.replyText = e.detail.value; }
})
