// pages/test/test.js
const loginManager = require('../../utils/loginManager.js')
const net4Post = require('../../utils/net4Post.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 基础数据
        name : '按时大大',
        range : ['x1', 'x2'],
        initVal : 'x1',
        disabled: true
    },
    onLoad: function() {
    },
    onChange: function(e) {
        console.log(e)
    }
})
