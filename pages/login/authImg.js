module.exports = {
    buildImg: function (Object) {
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

        var context = wx.createCanvasContext(Object.canvasId, Object.content);
        // 绘制
        context.setFillStyle(bgColor);
        context.fillRect(0, 0, Object.width, Object.height);
        context.draw();
        context.setFontSize(Object.width / 4);
        context.setFillStyle(lineColor);
        context.fillText(Object.authCode, Object.width / 4 - rand * 5, Object.width / 5 + rand * 5);
        context.draw(true);
        // 导出临时链接
        setTimeout(() => {
            wx.canvasToTempFilePath({
                canvasId: Object.canvasId,
                success: function (res) {
                    Object.success(res.tempFilePath);
                },
                fail: function (e) {
                    Object.fail();
                }
            }, Object.content)
        }, Object.interval);
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
