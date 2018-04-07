// pages/test/test.js
const loginManager = require('../../utils/loginManager.js')
const net4Post = require('../../utils/net4Post.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 基础数据
        value: ""
    },
    onLoad: function() {
        var that = this;
        setTimeout(function() {
            that.setData({ value : "啊啊啊啊" });
        }, 6000);
    },
    onChange: function(e) {
        console.log(e)
    }
})
