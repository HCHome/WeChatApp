//app.js

App({
    globalData: {
        applyDate: null,
        url_hc: "https://cjtellyou.xyz/HCHomeServer"
    },
    onLaunch: function () { 

    },
    onHide: function () {
        var loginManager = require('..//utils/loginManager.js');
        loginManager.hc_logout();
    }

})