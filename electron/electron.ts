import 'dotenv/config';
import { enable, initialize } from '@electron/remote/main';
import axios from 'axios';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';
import fetch from 'electron-fetch';
import * as fs from 'fs';
import * as glob from 'glob';
import https from 'https';
import * as NodeID3 from 'node-id3';
import * as path from 'path';
import trash from 'trash';

import {
  addMusics,
  openPreference,
  resetMusic,
  saveMusics,
  searchMusic,
  setCount,
} from './apis';

https.globalAgent.options.rejectUnauthorized = false;
axios.defaults.baseURL = 'https://api.discogs.com';
axios.defaults.headers.common = { Authorization: `Discogs token=${process.env.DISCOGS_API_TOKEN}` };

const close = () => null;

const isMac = process.platform === 'darwin';

app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);
app.on('will-quit', close);

initialize();

const openFiles: string[] = [];
let win: BrowserWindow;
const createWindow = async () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  const showOpenFile = () => {
    dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Musics', extensions: ['mp3'] }], // TODO: support more music formats (ex. wav, flac, m4p, m4a)
    }).then(({ filePaths }) => {
      if (filePaths.length) {
        resetMusic(win);
        setCount(win, filePaths.length);
      }
      addMusics(win, filePaths);
    });
  };

  const showAddFile = () => {
    dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Musics', extensions: ['mp3'] }], // TODO: support more music formats (ex. wav, flac, m4p, m4a)
    }).then(({ filePaths }) => {
      setCount(win, filePaths.length);
      addMusics(win, filePaths);
    });
  };

  const showOpenDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths: dirPaths }) => {
      if (dirPaths.length) {
        resetMusic(win);
      }
      const paths = dirPaths.reduce((arr, dirPath) => {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3')); // TODO: support more music formats (ex. wav, flac, m4p, m4a)
        return arr.concat(filePaths);
      }, [] as string[]);
      setCount(win, paths.length);
      addMusics(win, paths);
    });
  };

  const showAddDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths: dirPaths }) => {
      dirPaths.forEach((dirPath) => {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3')); // TODO: support more music formats (ex. wav, flac, m4p, m4a)
        setCount(win, filePaths.length);
        addMusics(win, filePaths);
      });
    });
  };

  if (!app.isPackaged) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        {
          label: 'Preferences...',
          click: () => openPreference(win),
          accelerator: 'Command+,',
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Files',
          click: showOpenFile,
        },
        {
          label: 'Open Directories',
          click: showOpenDirectory,
        },
        {
          label: 'Add Files',
          click: showAddFile,
        },
        {
          label: 'Add Directories',
          click: showAddDirectory,
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
        ] : []),
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
      ],
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggledevtools' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        ] : [
          { role: 'close' },
        ]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/jin60641/eletron-music-tag-editor');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[]);
  Menu.setApplicationMenu(menu);

  ipcMain.on('MUSIC.REMOVE_MUSICS', async  (_event, { filePaths }) => {
    await trash(filePaths);
  });

  ipcMain.on('MUSIC.OPEN_FINDER', (_event, filePath) => {
    shell.showItemInFolder(filePath);
  });

  ipcMain.on('MUSIC.OPEN_MUSIC', (_event, dirPaths: string[]) => {
    dirPaths.forEach((dirPath) => {
      if (fs.lstatSync(dirPath).isDirectory()) {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3'));
        setCount(win, filePaths.length);
        addMusics(win, filePaths);
      } else {
        setCount(win, 1);
        addMusics(win, [dirPath]);
      }
    });
  });

  ipcMain.on('MUSIC.ADD_MUSICS', (_event, filePaths) => {
    setCount(win, filePaths.length);
    addMusics(win, filePaths);
  });

  ipcMain.on('MUSIC.SEARCH_MUSIC', (_event, query) => {
    axios.get<any>(`/database/search?q=${encodeURIComponent(query)}&page=1&per_page=5`)
      .then(({ data }) => {
        if (data?.results?.length) {
          const result = data.results.map((item: any) => ({ picture: item.cover_image }));
          searchMusic(win, result);
        } else {
          searchMusic(win, []);
        }
      }).catch((e) => { console.log(e); });
  });

  ipcMain.on('MUSIC.SAVE_MUSIC', async (_event, {
    filePaths,
    metadata: {
      albumartist: performerInfo,
      track: trackNumber,
      disk: partOfSet,
      comment,
      picture: image,
      ...metadata
    },
  }) => {
    const rawTags = {
      ...metadata,
      comment,
      trackNumber,
      partOfSet,
      performerInfo,
    };
    const tags = Object.entries(rawTags).reduce((obj, [key, value]) => (value === undefined ? obj : {
      ...obj,
      [key]: value,
    }), {} as typeof rawTags);

    if (tags.comment) {
      tags.comment = {
        language: 'eng',
        text: comment,
      };
    }

    if (image !== undefined) {
      if (image instanceof Uint8Array) {
        tags.image = Buffer.from(image);
      } else if (/https?:\/\//.test(image) && !fs.existsSync(image)) { // external file path (ex. https://your.web/img.jpg)
        const response = await fetch(image);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        tags.image = buffer;
      } else { // local file path (ex. ~/img.jpg) or empty string
        tags.image = image;
      }
    }

    const deletedTags = Object.entries(tags)
      .filter(([_key, value]) => value === '')
      .map(([key]) => key);

    filePaths.forEach((filePath: string) => {
      const updatedTags = { ...NodeID3.read(filePath, { noRaw: true }), ...tags };
      deletedTags.forEach((tag) => {
        delete updatedTags[tag];
      });
      if (updatedTags.image?.mime) {
        delete updatedTags.image.mime;
      }
      NodeID3.write(updatedTags, filePath);
    });
    saveMusics(win, filePaths);
  });

  await enable(win.webContents);
  ipcMain.on('INIT', () => {
    if (openFiles.length) {
      setCount(win, openFiles.length);
      addMusics(win, openFiles);
    }
  });
};

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    event.preventDefault();
    if (win) {
      setCount(win, 1);
      addMusics(win, [file]);
    } else {
      openFiles.push(file);
    }
  });
});

app.whenReady().then(createWindow);
