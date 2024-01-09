import {
  clipboard,
  contextBridge,
  ipcRenderer,
} from 'electron';

import storage from './storage';

contextBridge.exposeInMainWorld(
  'bridge', {
    storage,
    pasteImage: () => {
      const image = clipboard.readImage();
      return image.toPNG();
    },
    pasteText: () => {
      const text = clipboard.readText();
      return text;
    },
    ipc: {
      send: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
      },
      receive: (channel: string, func: any) => {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      },
    },
  },
);

export {};
