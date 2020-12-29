import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as NodeID3 from 'node-id3';

export const resetMusic = (win: BrowserWindow) => {
  win.webContents.send('MUSIC.RESET_MUSIC');
};

export const setCount = (win: BrowserWindow, count: number) => {
  win.webContents.send('MUSIC.SET_COUNT', count);
};

export const addMusic = (win: BrowserWindow, filePath: string) => {
  win.webContents.send('MUSIC.ADD_MUSIC', ({
    metadata: NodeID3.read(filePath, { noRaw: true }),
    path: filePath,
  }));
};

export const saveMusic = (win: BrowserWindow, filePath: string) => {
  win.webContents.send('MUSIC.UPDATE_MUSIC', ({
    metadata: NodeID3.read(filePath, { noRaw: true}),
    path: filePath,
  }));
};
