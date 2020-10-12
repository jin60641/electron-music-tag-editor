import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';
import * as isDev from 'electron-is-dev';
import * as fs from 'fs';
import * as glob from 'glob';
import * as NodeID3 from 'node-id3';
import * as path from 'path';

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
        win.webContents.send('RESET_MUSIC');
      }
      filePaths.forEach((filePath) => {
        fs.readFile(filePath, (err, buffer) => {
          if (!err) {
            win.webContents.send('ADD_MUSIC', ({
              path: filePath,
              buffer,
            }));
          }
        });
      });
    });
  };

  const showAddFile = () => {
    dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Musics', extensions: ['mp3'] }], // TODO: support more music formats (ex. wav, flac, m4p, m4a)
    }).then(({ filePaths }) => {
      filePaths.forEach((filePath) => {
        fs.readFile(filePath, (err, buffer) => {
          if (!err) {
            win.webContents.send('ADD_MUSIC', ({
              path: filePath,
              buffer,
            }));
          }
        });
      });
    });
  };

  const showOpenDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths }) => {
      if (filePaths.length) {
        win.webContents.send('RESET_MUSIC');
      }
      filePaths.forEach((dirPath) => {
        glob.sync(path.join(dirPath, '**/*.mp3')).forEach((filePath) => { // TODO: support more music formats (ex. wav, flac, m4p, m4a)
          fs.readFile(filePath, (err, buffer) => {
            if (!err) {
              win.webContents.send('ADD_MUSIC', ({
                path: filePath,
                buffer,
              }));
            }
          });
        });
      });
    });
  };

  const showAddDirectory = () => {
    dialog.showOpenDialog(win, { properties: ['openDirectory', 'multiSelections'] }).then(({ filePaths }) => {
      filePaths.forEach((dirPath) => {
        glob.sync(path.join(dirPath, '**/*.mp3')).forEach((filePath) => { // TODO: support more music formats (ex. wav, flac, m4p, m4a)
          fs.readFile(filePath, (err, buffer) => {
            if (!err) {
              win.webContents.send('ADD_MUSIC', ({
                path: filePath,
                buffer,
              }));
            }
          });
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

  ipcMain.on('OPEN_MUSIC', (_event, dirPaths: string[]) => {
    dirPaths.forEach((dirPath) => {
      if (fs.lstatSync(dirPath).isDirectory()) {
        glob.sync(path.join(dirPath, '**/*.mp3')).forEach((filePath) => {
          fs.readFile(filePath, (err, buffer) => {
            if (!err) {
              win.webContents.send('ADD_MUSIC', ({
                path: filePath,
                buffer,
              }));
            }
          });
        });
      } else {
        fs.readFile(dirPath, (err, buffer) => {
          if (!err) {
            win.webContents.send('ADD_MUSIC', ({
              path: dirPath,
              buffer,
            }));
          }
        });
      }
    });
  });

  ipcMain.on('ADD_MUSIC', (_event, filePath) => {
    fs.readFile(filePath, (err, buffer) => {
      if (!err) {
        win.webContents.send('ADD_MUSIC', ({
          path: filePath,
          buffer,
        }));
      }
    });
  });

  ipcMain.on('SAVE_MUSIC', (_event, {
    filePaths,
    metadata: {
      albumartist: TPE2,
      picture,
      ...metadata
    },
  }) => {
    const tags = { ...metadata };
    if (TPE2 !== undefined) {
      tags.TPE2 = TPE2;
    }
    if (picture !== undefined) {
      const [APIC] = picture;
      if (Array.isArray(APIC)) {
        tags.APIC = Buffer.from(APIC);
      } else {
        tags.APIC = APIC;
      }
    }
    filePaths.forEach((filePath: string) => {
      NodeID3.update(tags, filePath, (err) => {
        if (!err) {
          fs.readFile(filePath, (err2, buffer) => {
            if (!err2) {
              win.webContents.send('SAVE_MUSIC#SUCCESS', ({
                path: filePath,
                buffer,
              }));
            }
          });
        }
      });
    });
  });
};

app.whenReady().then(createWindow);