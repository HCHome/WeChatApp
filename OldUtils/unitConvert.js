module.exports = {
    rpx2px: function(rpxValue) {
        return wx.getSystemInfoSync().windowWidth / 750 * rpxValue;
    }
}