// pages/cylist/cylist.js
var net4Cylist = require("../../utils/net4Cylist.js")
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 加载中
        isLoading: true,

        // 搜索相关
        inputShowed: false,
        inputVal: "",
        searchWord: "",

        // 筛选
        sexArr: [
            { val: "男",  checked: false },
            { val: "女",  checked: false },
            { val: "不限", checked: true }
        ],
        singleArr:[
            { val: "是",  checked: false },
            { val: "否",  checked: false },
            { val: "不限", checked: true }
        ],
        termArr: [],
        termIndex: 0,

        // 用户列表
        users: [/*eg: {
            userId: 1,
            nickname: "许佳灿",
            school: "未知学校",
            term: "2011",
            job: "未就业",
            major: "未知专业"
        }*/]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var termStart = app.globalData.terms.start;
        var termEnd = app.globalData.terms.end;
        var tmp = ["不限"]
        for (var i = termStart; i <= termEnd; i++) tmp.push(i);
        this.setData({ termArr: tmp });
        this.getList();
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
    search: function(e) {
        // TODO 搜索筛人
        this.setData({ searchWord: this.data.inputVal });
    },
    rmSearch: function(e) {
        // TODO 去掉搜索
        this.setData({ searchWord: "" });
    },

    /**
     * 筛选
     */
    sexSelect: function(e) {
        if (this.data.sexArr[e.currentTarget.dataset.index].checked) return;

        var tmp = this.data.sexArr;
        for (var i = tmp.length - 1; i >= 0; i--) {
            tmp[i].checked = (i == e.currentTarget.dataset.index)
        }
        this.setData({ sexArr: tmp })
        this.getList();
    },

    singleSelect: function(e) {
        if (this.data.singleArr[e.currentTarget.dataset.index].checked) return;

        var tmp = this.data.singleArr;
        for (var i = tmp.length - 1; i >= 0; i--) {
            tmp[i].checked = (i == e.currentTarget.dataset.index)
        }
        this.setData({ singleArr: tmp })
        this.getList();
    },

    termSelect: function(e) {
        if (this.data.termIndex == e.detail.value) return;
        this.setData({ termIndex: e.detail.value });
        this.getList();
    },

    /**
     * 筛选
     */
    getList: function(lastID) {
        this.setData({
            isLoading: true,
            users: []
        })


        var that = this;
        var req = {
            lastUserId : lastID ? lastID : 0,
            success: res => {
                that.setData({ isLoading: false, users : res.data.data.users })
            }
        }

        var sex = null;
        this.data.sexArr.forEach(item => { if (item.checked) sex = item.val; });
        if (sex != '不限') req.sex = sex;

        var singleDog = null;
        this.data.singleArr.forEach(item => { if (item.checked) singleDog = item.val; });
        if (singleDog != '不限') req.singleDog = singleDog;

        var term = this.data.termArr[this.data.termIndex];
        if (term != '不限') req.term = term;

        net4Cylist.getList(req);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
