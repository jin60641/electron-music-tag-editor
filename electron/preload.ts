import {
  clipboard,
  contextBridge,
  ipcRenderer,
  nativeImage,
} from 'electron';

import storage from './storage';

contextBridge.exposeInMainWorld(
  'bridge', {
    storage,
    copyImage: (imgUrl: string) => {
      const image = nativeImage.createFromDataURL(imgUrl);
      clipboard.writeImage(image);
    },
    pasteImage: () => {
      const image = clipboard.readImage();
      return image.toPNG();
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
