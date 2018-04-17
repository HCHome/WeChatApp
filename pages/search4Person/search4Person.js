// pages/search/search.js
const app = getApp()
var net4Search = require("../../../utils/net4Search.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        initVal: "",
        users: null
            // {
            //     userid: 1,
            //     nickname: "许佳灿",
            //     matchType: "nickname"
            // },
            // {
            //     userid: 2,
            //     nickname: "name",
            //     matchType: "工作",
            //     matchVal: "asasd"
            // }
        ,
        tabs: ["全部", "名字", "学校", "工作", "专业"],
        activeIndex: 0,
        sliderLeft: 0
    },

    _data: {
        tabs: [ "all", "nicknameResult", "schoolResult", "jobResult", "professionResult"],
        all: null,
        nicknameResult: null,
        schoolResult: null,
        jobResult: null,
        professionResult: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.keyWord) {
            this.setData({ initVal: options.keyWord });
            wx.setNavigationBarTitle({title: "搜索\"" + options.keyWord + "\"相关用户"});
            this.getResult(options.keyWord, options.searchID ? options.searchID : -1);
        }
    },
    /**
     * 请求搜索结果
     */
    getResult: function(keyWord) {
        var that = this;
        net4Search.search({
            type: "person",
            keyWord: keyWord,
            success4Person: res => {
                var tmp = net4Search.mergeUserList(res.data.data.jobResult, res.data.data.nicknameResult, res.data.data.professionResult, res.data.data.schoolResult);
                tmp.sort((a,b) => (a.userid - b.userid));
                that._data.all              = tmp;
                that._data.jobResult        = res.data.data.jobResult;
                that._data.nicknameResult   = res.data.data.nicknameResult;
                that._data.professionResult = res.data.data.professionResult;
                that._data.schoolResult     = res.data.data.schoolResult;
                that.setData({ users: that._data.all });
            },
        })
    },

    /**
     * 点击搜人的结果
     */
    onUserTap: function(e) {
        wx.navigateTo({ url: "/pages/personinfo/personinfo?userId=" + e.currentTarget.dataset.user.userId });
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
     * Tab切换和移动
     */
    slideClick: function(e) {
        this.setData({
            activeIndex: e.currentTarget.id,
            sliderLeft: e.currentTarget.id * 6 + 'em',
            users: this._data[this._data.tabs[e.currentTarget.id]]
        });
    }
})
