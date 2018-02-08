//app.js

App({
    globalData: {
        applyDate: null,
        url_hc: "https://119.29.189.146/HCHomeServer"
    },
    onLaunch: function () { 

    },
    onHide: function () {
        var loginManager = require('..//utils/loginManager.js');
        loginManager.hc_logout();
    }

})