"use strict";
exports.__esModule = true;
exports.saveMusic = exports.addMusic = exports.setCount = exports.resetMusic = void 0;
var NodeID3 = require("node-id3");
var resetMusic = function (win) {
    win.webContents.send('MUSIC.RESET_MUSIC');
};
exports.resetMusic = resetMusic;
var setCount = function (win, count) {
    win.webContents.send('MUSIC.SET_COUNT', count);
};
exports.setCount = setCount;
var addMusic = function (win, filePath) {
    win.webContents.send('MUSIC.ADD_MUSIC', ({
        metadata: NodeID3.read(filePath, { noRaw: true }),
        path: filePath
    }));
};
exports.addMusic = addMusic;
var saveMusic = function (win, filePath) {
    win.webContents.send('MUSIC.UPDATE_MUSIC', ({
        metadata: NodeID3.read(filePath, { noRaw: true }),
        path: filePath
    }));
};
exports.saveMusic = saveMusic;
