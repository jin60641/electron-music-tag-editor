"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var electron_1 = require("electron");
var glob = require("glob");
var isDev = require("electron-is-dev");
var path = require("path");
var fs = require("fs");
var NodeID3 = require("node-id3");
var close = function () { return null; };
var isMac = process.platform === 'darwin';
electron_1.app.on('window-all-closed', function () {
    close();
    electron_1.app.quit();
});
electron_1.app.on('before-quit', close);
electron_1.app.on('will-quit', close);
var createWindow = function () {
    // Create the browser window.
    var win = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: __dirname + '/preload.js'
        }
    });
    var showOpenFile = function () {
        electron_1.dialog.showOpenDialog(win, {
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Musics', extensions: ['mp3'] }]
        }).then(function (_a) {
            var filePaths = _a.filePaths;
            if (filePaths) {
                win.webContents.send('RESET_MUSIC');
            }
            filePaths.forEach(function (filePath) {
                fs.readFile(filePath, function (err, buffer) {
                    if (!err) {
                        win.webContents.send('ADD_MUSIC', ({
                            path: filePath,
                            buffer: buffer
                        }));
                    }
                    else {
                    }
                });
            });
        });
    };
    var showAddFile = function () {
        electron_1.dialog.showOpenDialog(win, {
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Musics', extensions: ['mp3'] }]
        }).then(function (_a) {
            var filePaths = _a.filePaths;
            filePaths.forEach(function (filePath) {
                fs.readFile(filePath, function (err, buffer) {
                    if (!err) {
                        win.webContents.send('ADD_MUSIC', ({
                            path: filePath,
                            buffer: buffer
                        }));
                    }
                });
            });
        });
    };
    var showOpenDirectory = function () {
        electron_1.dialog.showOpenDialog(win, {
            properties: ['openDirectory', 'multiSelections']
        }).then(function (_a) {
            var filePaths = _a.filePaths;
            if (filePaths) {
                win.webContents.send('RESET_MUSIC');
            }
            filePaths.forEach(function (dirPath) {
                glob.sync(path.join(dirPath, '**/*.mp3')).forEach(function (filePath) {
                    fs.readFile(filePath, function (err, buffer) {
                        if (!err) {
                            win.webContents.send('ADD_MUSIC', ({
                                path: filePath,
                                buffer: buffer
                            }));
                        }
                    });
                });
            });
        });
    };
    var showAddDirectory = function () {
        electron_1.dialog.showOpenDialog(win, {
            properties: ['openDirectory', 'multiSelections']
        }).then(function (_a) {
            var filePaths = _a.filePaths;
            if (filePaths) {
                win.webContents.send('RESET_MUSIC');
            }
            filePaths.forEach(function (dirPath) {
                glob.sync(path.join(dirPath, '**/*.mp3')).forEach(function (filePath) {
                    fs.readFile(filePath, function (err, buffer) {
                        if (!err) {
                            win.webContents.send('ADD_MUSIC', ({
                                path: filePath,
                                buffer: buffer
                            }));
                        }
                    });
                });
            });
        });
    };
    if (isDev) {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    }
    else {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    }
    /*
    if (process.env.NODE_ENV !== 'production') {
      win.webContents.openDevTools()
    }
    */
    var template = __spreadArrays((isMac ? [{
            label: electron_1.app.name,
            submenu: [
                { role: 'about' },
            ]
        }] : []), [
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Files',
                    click: showOpenFile
                },
                {
                    label: 'Open Directories',
                    click: showOpenDirectory
                },
                {
                    label: 'Add Files',
                    click: showAddFile
                },
                {
                    label: 'Add Directories',
                    click: showAddDirectory
                },
                isMac ? { role: 'close' } : { role: 'quit' },
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: __spreadArrays([
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ], (isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ]))
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: __spreadArrays([
                { role: 'minimize' },
                { role: 'zoom' }
            ], (isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ]))
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, electron_1.shell.openExternal('https://github.com/jin60641/eletron-music-tag-editor')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                }
            ]
        }
    ]);
    var menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
    electron_1.ipcMain.on('ADD_MUSIC', function (event, filePath) {
        fs.readFile(filePath, function (err, buffer) {
            if (!err) {
                win.webContents.send('ADD_MUSIC', ({
                    path: filePath,
                    buffer: buffer
                }));
            }
        });
    });
    electron_1.ipcMain.on('SAVE_MUSIC', function (event, _a) {
        var filePaths = _a.filePaths, _b = _a.metadata, TPE2 = _b.albumartist, picture = _b.picture, metadata = __rest(_b, ["albumartist", "picture"]);
        var tags = __assign({}, metadata);
        if (TPE2 !== undefined) {
            tags.TPE2 = TPE2;
        }
        if (picture !== undefined) {
            var APIC = picture[0];
            tags.APIC = APIC;
        }
        filePaths.forEach(function (filePath) {
            NodeID3.update(tags, filePath, function (err) {
                if (!err) {
                    fs.readFile(filePath, function (err2, buffer) {
                        if (!err2) {
                            win.webContents.send('SAVE_MUSIC#SUCCESS', ({
                                path: filePath,
                                buffer: buffer
                            }));
                        }
                    });
                }
                else {
                    console.log(err);
                }
            });
        });
    });
};
electron_1.app.whenReady().then(createWindow);
