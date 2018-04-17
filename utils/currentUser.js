var _currentUser = {
    renewHCInfo: function(Object) {
        that.loginData.user = res.data.data.user;
        if (that.loginData.user.avatar)
            that.loginData.user.letter = that.loginData.user.nickname[that.loginData.user.nickname.length - 1];
    }
};


module.exports = _currentUser;
