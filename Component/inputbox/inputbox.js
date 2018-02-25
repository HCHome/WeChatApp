// Component/inputbox/inputbox.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 属性名
        name: {
            type: String,
            value: '属性'
        },
        // 初始数值
        value: {
            type: String,
            value: null,
            observer: '_selectValueChange'
        },
        // 输入框类型  select 或者 input
        mode: {
            type: String,
            value: 'select'
        },
        // 选择范围
        range: {
            type: Array,
            value: null
        },
        // 输入类型
        type: {
            type: String,
            value: 'text'
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 实时值
        showVal: '',
        selectIndex: 0
    },

    /**
     * 组件生命周期函数-插入页面节点
     */
    attached: function() {
        if (this.properties.mode == 'select')
            this.setData({
                showVal    : this.properties.value ? this.properties.value : "未知",
                selectIndex: this.properties.value ? this.properties.range.indexOf(this.properties.value) : -1
            });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 改变时触发事件
        selectChange: function(e) {
            this.setData({
                showVal : this.properties.range[e.detail.value]
            });
            this.triggerEvent('change', { value: this.data.showVal }, {});
        },
        inputChange: function(e) {
            this.triggerEvent('change', { value: e.detail.value }, {});
        },
        // 当选择状态下，选择的值被后台进行修改时
        _selectValueChange: function(newVal, oldVal) {
            if (this.setData && this.properties.mode == 'select') {
                this.setData({
                    showVal: newVal,
                    selectIndex: this.properties.range.indexOf(newVal)
                });
            }
        }
    }
})
