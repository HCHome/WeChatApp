const util = require('../../utils/util.js');

module.exports = {
    draw: function (canvasID, componentInstance, letter, size) {
        if (!size) var size = 300;
        const ctx = wx.createCanvasContext(canvasID, componentInstance);
        var colorPair = require('../../utils/util.js').randColorPair();
        // 画圆
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.setFillStyle(colorPair[0]);
        ctx.fill();

        // 写字
        var fontSize = Math.min(size, size);
        ctx.setFillStyle(colorPair[1]);
        ctx.setFontSize(fontSize / 2);
        ctx.setTextBaseline('middle');
        ctx.setTextAlign('center');
        ctx.fillText(letter, size / 2, size / 2);
        ctx.draw(true);
    }
}
