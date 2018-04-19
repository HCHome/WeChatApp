// Component/reply/reply.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        reply: {
            type: Object,
            value: null,
            observer: function (newVal, oldVal) {
                if (newVal.repliedFloor == 0) {
                    this.setData({ text: newVal.text });
                } else {
                    this.setData({ text: '回复#' + newVal.repliedFloor + ':' + newVal.text });
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        replierInfo: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onMenu: function (e) {
            e.reply = this.properties.reply;
            this.triggerEvent('replyMenu', e, {});
        },
        avatarTap: function (e) {
            wx.navigateTo({ url: "/pages/userDetail/userDetail?userId=" + this.properties.reply.replierId });
        }
    }
})
