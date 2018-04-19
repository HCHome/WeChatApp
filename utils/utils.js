/**
 * 比较杂乱不好分类的工具
 */

var _utils =  {
    rpx2px: function(rpxValue) {
        return wx.getSystemInfoSync().windowWidth / 750 * rpxValue;
    }
};

module.exports = _utils;
