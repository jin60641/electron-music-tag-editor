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
import * as isDev from 'electron-is-dev';
import * as fs from 'fs';
import * as glob from 'glob';
import * as NodeID3 from 'node-id3';
import * as path from 'path';

import {
  addMusic,
  resetMusic,
  saveMusic,
  setCount,
} from './apis';

const close = () => null;

const isMac = process.platform === 'darwin';

app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);
app.on('will-quit', close);

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
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
      filePaths.forEach((filePath) => addMusic(win, filePath));
    });
  };

  const showAddFile = () => {
    dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Musics', extensions: ['mp3'] }], // TODO: support more music formats (ex. wav, flac, m4p, m4a)
    }).then(({ filePaths }) => {
      setCount(win, filePaths.length);
      filePaths.forEach((filePath) => addMusic(win, filePath));
    });
  };

  const showOpenDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths: dirPaths }) => {
      if (dirPaths.length) {
        resetMusic(win);
      }
      dirPaths.forEach((dirPath) => {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3')); // TODO: support more music formats (ex. wav, flac, m4p, m4a)
        setCount(win, filePaths.length);
        filePaths.forEach((filePath) => {
          addMusic(win, filePath);
        });
      });
    });
  };

  const showAddDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths: dirPaths }) => {
      dirPaths.forEach((dirPath) => {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3')); // TODO: support more music formats (ex. wav, flac, m4p, m4a)
        setCount(win, filePaths.length);
        filePaths.forEach((filePath) => {
          addMusic(win, filePath);
        });
      });
    });
  };

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }

  /*
  if (process.env.NODE_ENV !== 'production') {
    win.webContents.openDevTools()
  }
  */
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
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
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' },
            ],
          },
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' },
        ]),
      ],
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
        { role: 'togglefullscreen' },
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

  ipcMain.on('MUSIC.OPEN_MUSIC', (_event, dirPaths: string[]) => {
    dirPaths.forEach((dirPath) => {
      if (fs.lstatSync(dirPath).isDirectory()) {
        const filePaths = glob.sync(path.join(dirPath, '**/*.mp3'));
        setCount(win, filePaths.length);
        filePaths.forEach((filePath) => addMusic(win, filePath));
      } else {
        setCount(win, 1);
        addMusic(win, dirPath);
      }
    });
  });

  ipcMain.on('MUSIC.ADD_MUSIC', (_event, filePath) => {
    setCount(win, 1);
    addMusic(win, filePath);
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
    const tags = {
      ...metadata,
      comment,
      trackNumber,
      partOfSet,
      performerInfo,
    };

    if (comment) {
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

    deletedTags.forEach((tag) => {
      delete tags[tag];
    });
    filePaths.forEach((filePath: string) => {
      NodeID3.update(tags, filePath, { exclude: deletedTags });
      saveMusic(win, filePath);
    });
  });
};

app.whenReady().then(createWindow);
