"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var storage_1 = require("./storage");
electron_1.contextBridge.exposeInMainWorld('bridge', {
    storage: storage_1["default"],
    copyImage: function (imgUrl) {
        var image = electron_1.nativeImage.createFromDataURL(imgUrl);
        electron_1.clipboard.writeImage(image);
    },
    pasteImage: function () {
        var image = electron_1.clipboard.readImage();
        return image.toPNG();
    },
    ipc: {
        send: function (channel, data) {
            electron_1.ipcRenderer.send(channel, data);
        },
        receive: function (channel, func) {
            electron_1.ipcRenderer.on(channel, function (_event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return func.apply(void 0, args);
            });
        }
    }
});
