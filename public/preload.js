const {
  contextBridge,
  ipcRenderer
} = require('electron');
const fs = require('fs');
const storage = require('electron-store');

contextBridge.exposeInMainWorld(
  'bridge', {
    storage,
    ipc: {
      send: (channel, data) => {
        ipcRenderer.send(channel, data);
      },
      receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
    },
  },
);

