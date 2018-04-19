// Component/avatar/avatar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        letter: {
            type: String,
            value: '',
            observer: function(newVal, oldVal) {
                this.draw();
            }
        },
        imageUrl: {
            type: String,
            value: '',
            observer: function(newVal, oldVal) {
                this.draw();
            }
        },
        scale: {
            type: String,
            value: '1',
            observer: function(newVal, oldVal) {
                this.draw();
            }
        },
        rpxSize: {
            type: String,
            value: null,
            observer: function(newVal, oldVal) {
                this.draw();
            }
        },
        pxSize: {
            type: String,
            value: null,
            observer: function(newVal, oldVal) {
                this.draw();
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        size: '50px'
    },


    /**
     * 组件的方法列表
     */
    methods: {
        draw: function(e) {
            // 尺寸相关
            var size = null;
            var utils = require('../../utils/utils.js');
            if (this.data.pxSize != null)
                size = parseInt(this.data.pxSize);
            else if (this.data.rpxSize != null)
                size = utils.rpx2px(parseFloat(this.data.rpxSize));
            else
                size = utils.rpx2px(100);
            size = size * parseFloat(this.data.scale);
            this.setData({ size: size + 'px' });
            // 如果给了letter 就绘图
            if (this.data.letter && this.data.letter != '' && this.data.imageUrl == '') {
                // 绘图
                var builder = require('./avatarBuilder.js');
                builder.draw('avatar', this, this.data.letter, size);
            }
        }
    }
})
