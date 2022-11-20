"use strict";
exports.__esModule = true;
exports.openPreference = exports.saveMusics = exports.addMusics = exports.searchMusic = exports.removeMusics = exports.setCount = exports.resetMusic = void 0;
var fs = require("fs");
var NodeID3 = require("node-id3");
var resetMusic = function (win) {
    win.webContents.send('MUSIC.RESET_MUSIC');
};
exports.resetMusic = resetMusic;
var setCount = function (win, count) {
    win.webContents.send('MUSIC.SET_COUNT', count);
};
exports.setCount = setCount;
var removeMusics = function (win, filePaths) {
    win.webContents.send('MUSIC.REMOVE_MUSICS', ({ filePaths: filePaths }));
};
exports.removeMusics = removeMusics;
var searchMusic = function (win, result) {
    if (result.length) {
        win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', result);
    }
    else {
        win.webContents.send('MUSIC.SEARCH_MUSIC#FAILURE');
    }
};
exports.searchMusic = searchMusic;
var addMusics = function (win, filePaths) {
    var removedPaths = [];
    var musics = filePaths.reduce(function (arr, filePath) {
        var isExist = fs.existsSync(filePath);
        if (!isExist) {
            removedPaths.push(filePath);
            return arr;
        }
        return arr.concat([{
                metadata: NodeID3.read(filePath, { noRaw: true }),
                path: filePath
            }]);
    }, []);
    exports.removeMusics(win, removedPaths);
    if (musics.length) {
        win.webContents.send('MUSIC.ADD_MUSICS', musics);
    }
};
exports.addMusics = addMusics;
var saveMusics = function (win, filePaths) {
    var removedPaths = [];
    var musics = filePaths.reduce(function (arr, filePath) {
        var isExist = fs.existsSync(filePath);
        if (!isExist) {
            removedPaths.push(filePath);
            return arr;
        }
        return arr.concat([{
                metadata: NodeID3.read(filePath, { noRaw: true }),
                path: filePath
            }]);
    }, []);
    exports.removeMusics(win, removedPaths);
    if (musics.length) {
        win.webContents.send('MUSIC.UPDATE_MUSIC', musics);
    }
};
exports.saveMusics = saveMusics;
var openPreference = function (win) {
    win.webContents.send('LAYOUT.SET_PREFERENCE', '');
};
exports.openPreference = openPreference;
