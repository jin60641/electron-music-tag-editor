"use strict";
exports.__esModule = true;
exports.addMusic = exports.setCount = exports.resetMusic = void 0;
var fs = require("fs");
exports.resetMusic = function (win) {
    win.webContents.send('MUSIC.RESET_MUSIC');
};
exports.setCount = function (win, count) {
    win.webContents.send('MUSIC.SET_COUNT', count);
};
exports.addMusic = function (win, filePath) {
    fs.readFile(filePath, function (err, buffer) {
        if (!err) {
            win.webContents.send('MUSIC.ADD_MUSIC', ({
                path: filePath,
                buffer: buffer
            }));
        }
    });
};
