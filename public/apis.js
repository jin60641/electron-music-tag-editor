"use strict";
exports.__esModule = true;
exports.saveMusic = exports.addMusic = exports.setCount = exports.resetMusic = void 0;
var fs = require("fs");
var resetMusic = function (win) {
    win.webContents.send('MUSIC.RESET_MUSIC');
};
exports.resetMusic = resetMusic;
var setCount = function (win, count) {
    win.webContents.send('MUSIC.SET_COUNT', count);
};
exports.setCount = setCount;
var addMusic = function (win, filePath) {
    fs.readFile(filePath, function (err, buffer) {
        if (!err) {
            win.webContents.send('MUSIC.ADD_MUSIC', ({
                path: filePath,
                buffer: buffer
            }));
        }
    });
};
exports.addMusic = addMusic;
var saveMusic = function (win, filePath) {
    fs.readFile(filePath, function (err, buffer) {
        if (!err) {
            win.webContents.send('MUSIC.UPDATE_MUSIC', ({
                path: filePath,
                buffer: buffer
            }));
        }
    });
};
exports.saveMusic = saveMusic;
