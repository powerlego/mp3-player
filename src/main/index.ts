import { app, shell, BrowserWindow, ipcMain, dialog, Menu, protocol } from "electron";
import { join } from "path";
import { electronApp, optimizer, is, platform } from "@electron-toolkit/utils";
import ElectronStore from "electron-store";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import { devTools } from "@electron-toolkit/utils";
import fs from "fs";
import os from "os";
import { parseBuffer } from "music-metadata";

const store = new ElectronStore();

const readFileAndSend = async (window: BrowserWindow, filePath: string, play: boolean) => {
  const buffer = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(buffer);
  const metadata = await parseBuffer(buffer, "audio/mpeg");
  let pictureBase64 = "";
  let pictureFormat = "";
  if (metadata.common.picture && metadata.common.picture.length > 0) {
    const picture = metadata.common.picture[0];
    pictureBase64 = picture.data.toString("base64");
    pictureFormat = picture.format;
  }
  window.webContents.send(
    "open-file",
    {
      metadata,
      uint8Array,
      picture: {
        base64: pictureBase64,
        format: pictureFormat,
      },
    },
    play
  );
};

const menuTemplate: (Electron.MenuItem | Electron.MenuItemConstructorOptions)[] = [
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [
      {
        label: "Open File",
        accelerator: "CmdOrCtrl+O",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [
              {
                name: "Audio Files",
                extensions: ["mp3", "wav", "ogg", "flac"],
              },
            ],
          });
          if (filePaths.length > 0) {
            const window = BrowserWindow.getAllWindows()[0];
            if (window) {
              readFileAndSend(window, filePaths[0], false);
            }
          }
        },
      },
      {
        label: "Add Folder",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
          });
          if (filePaths.length > 0) {
            const folderPaths: string[] = store.get("folderPaths", []) as string[];
            folderPaths.push(filePaths[0]);
            store.set("folderPaths", folderPaths);
            const window = BrowserWindow.getAllWindows()[0];
            if (window) {
              window.webContents.send("add-folder");
            }
          }
        },
      },
      { type: "separator" },
      platform.isMacOS ? { role: "close" } : { role: "quit" },
    ],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      {
        label: "Preferences",
        accelerator: "CmdOrCtrl+,",
        click: () => {
          const window = BrowserWindow.getAllWindows()[0];
          if (window) {
            window.webContents.send("open-preferences");
          }
        },
      },
    ],
  },
  { role: "viewMenu" },
  {
    role: "help",
    submenu: [
      {
        label: "About",
        click: () => {
          dialog.showMessageBox({
            type: "info",
            title: "About",
            message: "MP3 Player",
            detail: "This is a music player.",
          });
        },
      },
      { type: "separator" },
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

setupTitlebar();

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 767,
    height: 670,
    show: false,
    minWidth: 600,
    titleBarStyle: "hidden",
    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  attachTitlebarToWindow(mainWindow);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.session.protocol.registerFileProtocol("file:", (request, callback) => {
    console.log(request.url);
    const url = request.url.replace("file:///", "");
    callback({ path: url });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const folderPaths: string[] = store.get("folderPaths", []) as string[];
  if (folderPaths.length === 0) {
    const MusicPath = join(os.homedir(), "Music");
    if (fs.existsSync(MusicPath)) {
      folderPaths.push(MusicPath);
    }
    store.set("folderPaths", folderPaths);
  }
  // Install react devtools
  devTools.install("REACT_DEVELOPER_TOOLS", { allowFileAccess: true });

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("ready", () => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const url = request.url.replace("file:///", "app:///");
    callback({ path: url });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("getAudioFile", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      {
        name: "Audio",
        extensions: ["mp3", "wav", "ogg"],
      },
    ],
  });
  if (!canceled) {
    return filePaths[0];
  }
  return null;
});

ipcMain.handle("loadAudioFile", async (_, file: string, play: boolean) => {
  const window = BrowserWindow.getAllWindows()[0];
  if (window) {
    readFileAndSend(window, file, play);
  }
});

ipcMain.handle("getStoreKey", (_, key) => {
  return store.get(key);
});

ipcMain.handle("setStoreKey", (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle("getAudioInfo", async (_, file: string) => {
  const buffer = fs.readFileSync(file);
  const metadata = await parseBuffer(buffer, "audio/mpeg");
  let pictureBase64 = "";
  let pictureFormat = "";
  if (metadata.common.picture && metadata.common.picture.length > 0) {
    const picture = metadata.common.picture[0];
    pictureBase64 = picture.data.toString("base64");
    pictureFormat = picture.format;
  }
  return {
    title: metadata.common.title,
    artist: metadata.common.artist,
    pictureBase64,
    pictureFormat,
  };
});
