// Component/ninegrid/ninegrid.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pictureCount: {
            value: 0,
            type: Number
        },
        pictureUrl: {
            value: [],
            type: Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 图片相关
        imgWid: 50,
        imgHeig: 50,
        imgContainWid: 180,
        firstLoad: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 图片加载
        imgLoad: function(e) {
            var utils = require('../../utils/utils.js');
            if (this.data.firstLoad) {
                this.data.firstLoad = false;
                if (this.properties.pictureCount == 0) return; // 无图 啥都不需要
                if (this.properties.pictureCount == 4) { // 4张图
                    this.setData({
                        imgWid: 60,
                        imgHeig: 60,
                        imgContainWid: 200
                    });
                } else if (this.properties.pictureCount > 4) { // 多张图
                    this.setData({
                        imgWid: 50,
                        imgHeig: 50,
                        imgContainWid: 200
                    });
                }
                /*
                // 这段暂时不需要用到，但是感觉可以用一用，先做保留吧
                else if (e.detail.width / e.detail.height > 5 / 3) { // 单张，太宽
                    var wid = Math.min(utils.rpx2px(750) - 20, 300);
                    this.setData({
                        imgWid: wid,
                        imgHeig: wid / 5 * 3,
                        imgContainWid: utils.rpx2px(750)
                    });
                }
                */
                else if (e.detail.width >= e.detail.height) { // 单张，不那么宽
                    this.setData({
                        imgWid: 200,
                        imgHeig: 200 / e.detail.width * e.detail.height,
                        imgContainWid: utils.rpx2px(750) - 40
                    });
                } else if (e.detail.width / e.detail.height > 3 / 5) {// 单张，不那么高
                    this.setData({
                        imgWid: 350 / e.detail.height * e.detail.width,
                        imgHeig: 350,
                        imgContainWid: utils.rpx2px(750) - 40
                    });
                } else { // 单张，太高
                    var height = Math.min(e.detail.height, 300);
                    this.setData({
                        imgWid: 200,
                        imgHeig: 350,
                        imgContainWid: utils.rpx2px(750) - 40
                    });
                }
            }
        },

        // 点击图片
        imgTap: function(e) {
            wx.previewImage({
                current: e.target.dataset.img,
                urls: this.properties.pictureUrl
            });
        }
    }
})
