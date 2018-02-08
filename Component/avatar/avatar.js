// Component/avatar/avatar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        letter: {
            type: String,
            value: ''
        },
        imageUrl: {
            type: String,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
    },

    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
        if (this.properties.letter.value != '') {
            var builder = require('./avatarBuilder.js');
            var unitConvert = require('../../utils/unitConvert.js');
            var size = unitConvert.rpx2px(100);
            builder.draw('avatar', this, this.properties.letter, size);
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
