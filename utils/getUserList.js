/**
 * 本模块只实现筛人的功能，因为后期这个接口可能要改，所以先单独拿出来
 * 筛人功能原本要给到后台关键词、性别、年级等信息进行筛选
 * 但是目前关键词搜索和其他参数筛选是两个接口，本模块的功能是综合这两个接口
 */

var app = getApp();

var getUserList = {
    /**
     * 根据给出的参数和关键词，给出最终的搜索结果
     * @param  {Object} Object 包含关键词和参数、回调函数
     * @return {null}
     */
    getResult: function(Object) {
        if (Object.searchWord) {
            var net4User = require("./net4User.js");
            net4User.search({
                keyWord: Object.searchWord,
                success: res => {
                    var tmp = net4User.mergeUserList(res.data.data.jobResult, res.data.data.nicknameResult, res.data.data.professionResult, res.data.data.schoolResult);

                    // 逐个筛选
                    var newRes = { users : [] };

                    tmp.forEach(item => {
                        if ((!Object.sex || item.sex == Object.sex)
                            && (!Object.term || item.term == Object.term)
                            && (typeof(Object.isSingleDog) == "undefined" || item.isSingleDog == Object.isSingleDog)) {
                            newRes.users.push(item)
                        }
                    })

                    newRes.users.sort((a,b) => (a.userid - b.userid));
                    if (Object && typeof(Object.success) == 'function') Object.success(newRes);
                }
            })
        } else {
            this.getList(Object);
        }
    },

    /**
     * 对应目前的筛选接口
     * @param  {Object} Object 传入筛选参数和回调函数
     * @return {null}
     */
    getList: function(Object) {
        var req = {
            url: app.globalData.url_hc + '/user/searchUser',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
                lastUserId: Object && Object.lastUserId ? lastUserId : 0
            },
            success: res => {
                if (Object && typeof(Object.success) == 'function')
                    Object.success({ users: res.data.data.users });
            },
            fail: () => { if (Object && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.term) req.data.term = Object.term;
        if (Object && Object.sex) req.data.sex = Object.sex;
        if (Object && typeof(Object.isSingleDog) != "undefined") req.data.isSingleDog = Object.isSingleDog;
        wx.request(req)
    }
}

module.exports = getUserList;
