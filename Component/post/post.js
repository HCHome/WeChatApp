// Component/post.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 这里传地址使用绝对地址，相对地址要相对组件定义所在文件夹
        post: {
            type: Object,
            value: {
                postId: -1,
                posterId: 0,
                posterNickname: "",
                posterAvatar: '',
                letter: '',
                title: "",
                category: "",
                createdDate: '2000.1.1',
                text: "",
                pictureUrl: [
                    ''
                ],
                repliesCount: 0
            },
            observer: function(newVal, oldVal) {
                this.setText(newVal.text)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showedText: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindAvatarTap: function(e) {
            e.post = this.properties.post;
            this.triggerEvent('AvatarTap', e, {})
        },
        bindTap: function(e) {
            e.post = this.properties.post;
            this.triggerEvent('Tap', e, {})
        },
        previewImg: function(e) {
            wx.previewImage({
                current: e.target.dataset.img,
                urls: this.properties.post.pictureUrl
            });
        },
        setText: function(text) {
            var sText = text;
            var count = 0;
            for (var i = 0; i < text.length; i++) {
                if (text[i] == "\n") count++;
                if (count >= 5) {
                    sText = text.substr(0, i) + "...";
                    break;
                }
            }
            this.setData({ showedText: sText });
        }
    }
})
