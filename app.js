//app.js
App({
    globalData: {
        applyDate: null,
        url_hc: "https://cjtellyou.xyz/HCHomeServer",
        categories: [
            { name: '实习就业', img: '/resources/实习就业.png' },
            { name: '潮友日常', img: '/resources/潮友日常.png' },
            { name: '学习交流', img: '/resources/学习交流.png' },
            { name: '求助发帖', img: '/resources/求助发帖.png' },
            { name: '线上活动', img: '/resources/线上活动.png' }
        ],
        terms: {
            start: 2003,
            end: 2018
        }
    },
    onLaunch: function() {},
    onHide: function() {}
})
