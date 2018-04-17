const app = getApp()
var _net4Search = {
    search: function(Object) {
        // 传进来的OBJ需要给两套success和fail
        if (Object && !Object.type) Object.type = "all";
        var personObj = {
            keyWord : Object.keyWord,
            matchType: Object.matchType,
            success : Object.success4Person,
            fail: Object.fail4Person
        }
        var postObj = {
            keyWord : Object.keyWord,
            category: Object.category,
            lastPostId: Object.lastPostId,
            success : Object.success4Post,
            fail: Object.fail4Post,
        }
        if (Object.type == "all")
            return new this.searchAll_class(this.searchPerson(personObj), this.searchPost(postObj));
        else if (Object.type == "person")
            return this.searchPerson(personObj);
        else if (Object.type == "post")
            return this.searchPost(postObj);
    },

    searchPerson: function(Object) {
        var req = {
            url: app.globalData.url_hc + '/user/searchUser',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { searchWord : Object.keyWord },
            success: res => { if (Object.success && typeof(Object.success) == "function") Object.success(res); },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.matchType) req.data.matchType = Object.matchType;
        return wx.request(req)
    },

    mergeUserList: function(jobResult, nicknameResult, professionResult, schoolResult) {
        jobResult.forEach((item, index) => {
            jobResult[index].matchType = "工作";
            jobResult[index].matchVal = item.job;
        });
        nicknameResult.forEach((item, index) => {
            nicknameResult[index].matchType = "nickname";
            nicknameResult[index].matchVal = item.nickname;
        });
        professionResult.forEach((item, index) => {
            professionResult[index].matchType = "专业";
            professionResult[index].matchVal = item.profession;
        });
        schoolResult.forEach((item, index) => {
            schoolResult[index].matchType = "学校";
            schoolResult[index].matchVal = item.school;
        });
        return jobResult.concat(nicknameResult).concat(professionResult).concat(schoolResult)
    },

    searchPost: function(Object) {
        var req = {
            url: app.globalData.url_hc + '/post/searchPosts',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: { searchWord : Object.keyWord },
            success: res => {
                var net4Post = require("net4Post.js")
                if (Object.success && typeof(Object.success) == "function") Object.success(net4Post._simplifyRes(res.data.status, res.data.data.postList));
            },
            fail: () => { if (Object.fail && typeof(Object.fail) == 'function') Object.fail(); }
        }
        if (Object && Object.category) req.data.category = Object.category;
        if (Object && Object.lastPostId) req.data.lastPostId = Object.lastPostId;
        return wx.request(req)
    },

    searchAll_class: function(personReq, postReq) {
        this.personReq = personReq;
        this.postReq = postReq;
        this.abort = function() {
            this.personReq.abort();
            this.postReq.abort();
        }
    }
}

module.exports = _net4Search;
