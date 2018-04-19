// pages/search/search.js
var net4Post = require("../../utils/net4Post.js")
var net4User = require("../../utils/net4User.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        initVal: "搜索",
        users: null,
        // eg: {
        //     userid: 4,
        //     nickname: "名字",
        //     matchType: "学校",
        //     matchVal: "中山大学"
        // }
        posts: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options && options.keyWord) {
            this.setData({ initVal: options.keyWord });
            this.search(options.keyWord)
        }
    },

    /**
     * 搜索帖子和用户
     */
    search: function(keyWord) {
        this.setData({ users: null, posts: null, initVal: keyWord });
        wx.showLoading({
            title: "正在搜索...",
            mask: true
        });
        var that = this;
        var tasks = [];
        tasks.push(new Promise((resolve, reject) => {
            net4Post.search({
                keyWord: keyWord,
                success: res => {
                    that.setData({ posts: res.posts.slice(0, 5) });
                    resolve();
                },
                fail: () => { reject(); }
            });
        }))
        tasks.push(new Promise((resolve, reject) => {
            net4User.search({
                keyWord: keyWord,
                success: res => {
                    var tmp = net4User.mergeUserList(res.data.data.jobResult, res.data.data.nicknameResult,
                        res.data.data.professionResult, res.data.data.schoolResult);
                    tmp.sort((a, b) => (a.userid - b.userid));
                    that.setData({ users: tmp.slice(0, 5) });
                    resolve();
                },
                fail: () => { reject(); }
            });
        }));
        Promise.all(tasks).then(results => {
            wx.hideLoading();
        }).catch((err) => {
            wx.hideLoading();
        });
    },

    /**
     * 点击结果
     */
    onUserTap: function(e) {
        wx.navigateTo({ url: "/pages/userDetail/userDetail?userId=" + e.currentTarget.dataset.user.userId });
    },

    onPostTap: function(e) {
        console.log(e)
        wx.navigateTo({ url: '/pages/postDetail/postDetail?post=' + JSON.stringify(e.currentTarget.dataset.post) });
    },

    /**
     * WeUI搜索的函数
     */
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
    },

    /**
     * 进行搜索
     */
    search_all: function(e) {
        this.search(e.detail.value)
    },

    /**
     * 查看更多
     */
    morePerson: function(e) {
        wx.navigateTo({
            url: "/pages/search4Person/search4Person?keyWord=" + this.data.initVal
        })
    },
    morePost: function(e) {
        wx.navigateTo({
            url: "/pages/search4Post/search4Post?keyWord=" + this.data.initVal
        })
    }
})
