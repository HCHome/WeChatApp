const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 处理帖子的日期时间
const formatDateTime = (str) => {
    // "Jan 27, 2018 10:57:24 PM"
    var date = new Date(str);
    return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
}

module.exports = {
    formatTime: formatTime,
    formatDateTime: formatDateTime
}
