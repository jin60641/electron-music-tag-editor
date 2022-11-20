import { BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as NodeID3 from 'node-id3';

export const resetMusic = (win: BrowserWindow) => {
  win.webContents.send('MUSIC.RESET_MUSIC');
};

export const setCount = (win: BrowserWindow, count: number) => {
  win.webContents.send('MUSIC.SET_COUNT', count);
};

export const removeMusics = (win: BrowserWindow, filePaths: string[]) => {
  win.webContents.send('MUSIC.REMOVE_MUSICS', ({ filePaths }));
};

export const searchMusic = (win: BrowserWindow, result: any[]) => {
  if (result.length) {
    win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', result);
  } else {
    win.webContents.send('MUSIC.SEARCH_MUSIC#FAILURE');
  }
};

export const addMusics = (win: BrowserWindow, filePaths: string[]) => {
  const removedPaths: any = [];
  const musics = filePaths.reduce((arr: any, filePath) => {
    const isExist = fs.existsSync(filePath);
    if (!isExist) {
      removedPaths.push(filePath);
      return arr;
    }
    return arr.concat([{
      metadata: NodeID3.read(filePath, { noRaw: true }),
      path: filePath,
    }]);
  }, []);
  removeMusics(win, removedPaths);
  if (musics.length) {
    win.webContents.send('MUSIC.ADD_MUSICS', musics);
  }
};

export const saveMusics = (win: BrowserWindow, filePaths: string[]) => {
  const removedPaths: any = [];
  const musics = filePaths.reduce((arr: any, filePath) => {
    const isExist = fs.existsSync(filePath);
    if (!isExist) {
      removedPaths.push(filePath);
      return arr;
    }
    return arr.concat([{
      metadata: NodeID3.read(filePath, { noRaw: true }),
      path: filePath,
    }]);
  }, []);
  removeMusics(win, removedPaths);
  if (musics.length) {
    win.webContents.send('MUSIC.UPDATE_MUSIC', musics);
  }
};

export const openPreference = (win: BrowserWindow) => {
  win.webContents.send('LAYOUT.SET_PREFERENCE', '');
};
