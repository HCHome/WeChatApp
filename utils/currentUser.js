/**
 * 和当前用户相关的操作，包括保存和更新当前用户的信息
 */

var _currentUser = {

    /**
     * 保存的用户信息
     * @type {Object}
     */
    data: {},

    /**
     * 更新信息中海潮的部分
     * @param  {Object} Object 海潮服务器发来的User对象
     * @return {null}
     */
    renewHCInfo: function(Object) {
        for (var prop in Object) {
            this.data[prop] = Object[prop];
        }
    }
};


module.exports = _currentUser;
