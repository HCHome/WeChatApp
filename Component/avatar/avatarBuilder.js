const util = require('../../utils/util.js');

module.exports = {
    draw: function (canvasID, componentInstance, letter, size) {
        if (!size) var size = 300;
        const ctx = wx.createCanvasContext(canvasID, componentInstance);
        var colorPair = ['#5AA7FF', '#ffffff'];
        // 画圆
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.setFillStyle(colorPair[0]);
        ctx.fill(false);

        // 写字
        ctx.setFillStyle(colorPair[1]);
        ctx.setFontSize(size / 2);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('center');
        ctx.fillText(letter, size / 2, size / 2);
        ctx.draw(true);
    }
}
