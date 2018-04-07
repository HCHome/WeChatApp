// pages/search/search.js
var net4Search = require("../../../utils/net4Search.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        initVal: "搜索",
        users: null
            // eg: {
            //     userid: 4,
            //     nickname: "名字",
            //     matchType: "学校",
            //     matchVal: "中山大学"
            // }
        , posts: null
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

    search: function(keyWord) {
        this.setData({ users: null , posts: null, initVal: keyWord })
        var that = this;
        net4Search.search({
            type: "all",
            keyWord: keyWord,
            success4Person: res => {
                var tmp = net4Search.mergeUserList(res.data.data.jobResult, res.data.data.nicknameResult,
                    res.data.data.professionResult, res.data.data.schoolResult);
                tmp.sort((a,b) => (a.userid - b.userid));
                that.setData({ users : tmp.slice(0, 5) });
            },
            success4Post: res => {
                that.setData({ posts: res.posts.slice(0, 5) })
            }
        })
    },

    /**
     * 点击结果
     */
    onUserTap: function(e) {
        console.log(e)
    },

    onPostTap: function(e) {
        console.log(e)
        wx.navigateTo({ url: '/pages/postdetail/postdetail?post=' + JSON.stringify(e.currentTarget.dataset.post) });
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
            url: "/pages/search/person/person?keyWord=" + this.data.initVal
        })
    },
    morePost: function(e) {
        wx.navigateTo({
            url: "/pages/search/post/post?keyWord=" + this.data.initVal
        })
    }
})
