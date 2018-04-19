// pages/search/search.js
const app = getApp()
var net4Post = require("../../utils/net4Post.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        initVal: "",
        posts: [],
        tabs: [],
        activeIndex: 0,
        sliderLeft: 0,
        tip: "正在加载"
    },

    _data: { },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var categories = ["全部"];
        var that = this;
        app.globalData.categories.forEach(item => {
            categories.push(item.name);
            that._data[item.name] = [];
        });
        this.setData({ tabs: categories });
        if (options) {
            wx.setNavigationBarTitle({title: "搜索\"" + options.keyWord + "\"相关帖子"});
            this.setData({ initVal: options.keyWord });
            this.search(options.keyWord);
        }
    },

    /**
     * 请求搜索结果
     */
    search: function(keyWord) {
        var that = this;
        net4Post.search({
            keyWord: keyWord,
            success: res => {
                that._data["全部"] = res.posts;
                res.posts.forEach(item => { that._data[item.category].push(item); });
                that.setData({ posts: that._data["全部"], tip: "暂无更多相关帖子" });
            },
        })
    },

    /**
     * 帖子分段加载
     */
    onReachBottom: function(e) {
        if (this.data.tip == "加载更多") {
            this.setData({ tip: "正在加载" });
        }
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
            posts: this._data[this.data.tabs[e.currentTarget.id]]
        });
    }
})
