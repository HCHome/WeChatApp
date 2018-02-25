module.exports = {
    buildImg: function(content, authCode, canvasId, width, height) {
        // 进行绘制
        // 设定颜色
        var rand = Math.random();
        var lineColor = 'red';
        var bgColor = 'green';
        if (rand * 3 < 1) {
            lineColor = 'green';
            bgColor = 'blue';
        } else if (rand * 3 < 2) {
            lineColor = 'blue';
            bgColor = 'red';
        }

        var context = wx.createCanvasContext(canvasId, content);
        // 背景
        context.setFillStyle(bgColor);
        context.fillRect(0, 0, width, height);
        // 写字
        context.setFontSize(width / 4);
        context.setFillStyle(lineColor);
        context.fillText(authCode, width / 4 - rand * 5, width / 5 + rand * 5);
        // 完成
        context.draw();
    },
    randStr: function () {
        var len = 4;
        // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        var chrs = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chrs.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += chrs.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}
