/**
 * 本文件代码不生效
 * 目前的回复采取直接获取所有回复的方式，但暂时保留这部分代码
 */

var net4Post = require("../../utils/net4Post.js");
var _replyManager = {
    /**
     * 一个帖子的所有回复列表
     * @type {Array}
     */
    replyList: [],

    /**
     * 获取一个帖子的所有回复
     * @param  {Object} Object 帖子ID和回调函数
     * @return {null}
     */
    getAllReplies: function(Object) {
        this.replyList = [];
        this.fragCount = 0;
        // 递归法
        var that = this;
        var net = lastId => {
            net4Post.getReply({
                lastReplyId: lastId,
                postId: Object.postId,
                success: res => {
                    if (res.status != 10001 || res.replyList.length == 0) {
                        Object.success(that.replyList);
                        return;
                    }

                    res.replyList.forEach(item => { that.replyList.push(item) })
                    that.replyList.sort((a, b) => (a.floor - b.floor));
                    net(that.replyList[that.replyList.length - 1].replyId);
                }
            });
        }
        net(0);
    },

    /**
     * 20个20个的给
     * @return {Array} 回复列表
     */
    fragCount : 0,
    getReplyFrag: function() {
        return this.replyList.slice(fragCount * 20 + (++fragCount) * 20);
    },

    /*********** 原来采取多次获取策略用的页面响应函数 ****************/
    /**
     * 页面响应--触底函数
     */
    onReachBottom: function(e) {
        var lastID = this.data.replyList[this.data.replyList.length - 1].replyId;
        console.log(lastID)
        console.log(this.data.orderBtn == this._data.switchToLastest)
        if (this.data.orderBtn == this._data.switchToLastest) {
            this.getReply(lastID, true);
        } else {
            if (lastID - 20 > 0)
                this.getReply(lastID - 20, true);
            else
                this.setData({ tip: "已无更多回复" });
        }
    },

    /**
     * 获取回复，默认获取排序的前20个
     * @param  {int}     lastID 获取此ID之后的回复
     * @param  {Boolean} append 是否追加在列表之后
     * @return {null}
     */
    getReply: function(lastID, append) {
        this.setData({ tip: '正在加载' });
        wx.showNavigationBarLoading();

        if (!lastID) {
            if (this.orderBtn == this._data.switchToLastest)
                lastID = 0;
            else(this.orderBtn == this._data.switchToOldest)
                lastID = this.data.post.repliesCount - 20;
        }

        var that = this;
        net4Post.getReply({
            lastReplyId: lastID,
            postId: that.data.post.postId,
            success: res => {
                if (res.status != 10001)
                    return;

                // 排序
                if (this.data.orderBtn == this._data.switchToOldest) {
                    var sortFun = (a, b) => (b.floor - a.floor);
                } else {
                    var sortFun = (a, b) => (a.floor - b.floor);
                }
                res.replyList.sort(sortFun);

                var replies = append ? that.data.replyList.concat(res.replyList) : res.replyList;
                that.setData({ replyList: replies });
            },
            fail: () => {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                if (that.data.tip == '正在加载') {
                    that.setData({ tip: '暂无更多回复' });
                    setTimeout(() => { that.setData({ tip: '加载更多' }); }, 5000);
                }
            }
        })
    }
}

module.exports = _replyManager;
