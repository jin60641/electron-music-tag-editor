import * as fs from 'fs';
import { BrowserWindow } from 'electron';

export const resetMusic = (win: BrowserWindow) => {
  win.webContents.send('MUSIC.RESET_MUSIC');
}

export const setCount = (win: BrowserWindow, count: number) => {
  win.webContents.send('MUSIC.SET_COUNT', count);
}

export const addMusic = (win: BrowserWindow, filePath: string) => {
  fs.readFile(filePath, (err, buffer) => {
    if (!err) {
      win.webContents.send('MUSIC.ADD_MUSIC', ({
        path: filePath,
        buffer,
      }));
    }
  });
}
