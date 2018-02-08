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
                avatar: '',
                letter: '',
                title: "",
                category: "",
                createdDate: '2000.1.1',
                text: "",
                pictureUrl: [
                    ''
                ]
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindAvatarTap: function (e) {
            e.post = this.properties.post;
            this.triggerEvent('AvatarTap', e, {})
        },
        bindTap: function (e) {
            e.post = this.properties.post;
            this.triggerEvent('Tap', e, {})
        }
    }
})
