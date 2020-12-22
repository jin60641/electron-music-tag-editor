import { BrowserWindow } from 'electron';
import * as fs from 'fs';

export const resetMusic = (win: BrowserWindow) => {
  win.webContents.send('MUSIC.RESET_MUSIC');
};

export const setCount = (win: BrowserWindow, count: number) => {
  win.webContents.send('MUSIC.SET_COUNT', count);
};

export const addMusic = (win: BrowserWindow, filePath: string) => {
  fs.readFile(filePath, (err, buffer) => {
    if (!err) {
      win.webContents.send('MUSIC.ADD_MUSIC', ({
        path: filePath,
        buffer,
      }));
    }
  });
};

export const saveMusic = (win: BrowserWindow, filePath: string) => {
  fs.readFile(filePath, (err, buffer) => {
    if (!err) {
      win.webContents.send('MUSIC.UPDATE_MUSIC', ({
        path: filePath,
        buffer,
      }));
    }
  });
};
