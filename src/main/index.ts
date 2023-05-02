import { app, shell, BrowserWindow, ipcMain, dialog, protocol, Menu } from "electron";
import { join } from "path";
import { electronApp, optimizer, is, devTools, platform } from "@electron-toolkit/utils";
import store from "@/store";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import fs from "fs";
import os from "os";
// import fetch, { BodyInit, RequestInit, Response } from "node-fetch";
import { randomUUID } from "crypto";
import SettingsWindow from "./SettingsWindow";
import { parseBuffer } from "music-metadata";
import { CheckboxOption, SettingsAcceleratorField, SettingsRadioField } from "@/types";
import settingsUi from "@/assets/icons/settings_ui.svg?url";

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

const storeInstance = store.getInstance();
const settingsWindow = new SettingsWindow({
  defaults: {
    ui: {
      theme: "light",
    },
  },
  sections: [
    {
      id: "ui",
      label: "UI",
      icon: encodeURI(settingsUi),
      form: {
        groups: [
          {
            id: "ui",
            label: "UI",
            fields: [
              {
                type: "radio",
                key: "theme",
                label: "UI Theme",
                description: "The color theme of the UI",
                options: [
                  {
                    label: "Light",
                    value: "light",
                  },
                  {
                    label: "Dark",
                    value: "dark",
                  },
                ],
              } as SettingsRadioField,
            ],
          },
        ],
      },
    },
    {
      id: "test",
      label: "Testing",
      form: {
        groups: [
          {
            id: "accelerators",
            label: "Accelerators",
            fields: [
              {
                type: "accelerator",
                key: "accelerator1",
                label: "Accelerator (Normal)",
                description: "Accelerator (Normal)",
              } as SettingsAcceleratorField,
              {
                type: "accelerator",
                key: "accelerator2",
                label: "Accelerator (Modifier Required)",
                description: "Accelerator (Modifier Required)",
                modifierRequired: true,
              } as SettingsAcceleratorField,
              {
                type: "accelerator",
                key: "accelerator3",
                label: "Accelerator (Allow Only Modifier)",
                description: "Accelerator (Allow Only Modifier)",
                allowOnlyModifier: true,
              } as SettingsAcceleratorField,
            ],
          },
          {
            id: "checkboxes",
            label: "Checkboxes",
            fields: [
              {
                type: "checkbox",
                key: "checkbox1",
                label: "Checkbox (Single)",
                description: "Checkbox (Single)",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                ] as CheckboxOption[],
              },
              {
                type: "checkbox",
                key: "checkbox2",
                label: "Checkbox (Multiple)",
                description: "Checkbox (Multiple)",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                  {
                    label: "Option 3",
                    value: "option3",
                  },
                ] as CheckboxOption[],
              },
            ],
          },
          {
            id: "colors",
            label: "Colors",
            fields: [
              {
                type: "color",
                key: "color1",
                label: "Color (Hex)",
                description: "Color (Hex)",
                format: "hex",
              },
              {
                type: "color",
                key: "color2",
                label: "Color (RGB)",
                description: "Color (RGB)",
                format: "rgb",
              },
              {
                type: "color",
                key: "color3",
                label: "Color (HSL)",
                description: "Color (HSL)",
                format: "hsl",
              },
            ],
          },
          {
            id: "directories",
            label: "Directories",
            fields: [
              {
                type: "directory",
                key: "directory1",
                label: "Directory (Single)",
                description: "Directory (Single)",
                dontAddToRecent: true,
              },
              {
                type: "directory",
                key: "directory2",
                label: "Directory (Multiple)",
                description: "Directory (Multiple)",
                multiSelections: true,
                dontAddToRecent: true,
              },
            ],
          },
          {
            id: "dropdowns",
            label: "Dropdowns",
            fields: [
              {
                type: "dropdown",
                key: "dropdown1",
                label: "Dropdown",
                description: "Dropdown",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                  {
                    label: "Option 3",
                    value: "option3",
                  },
                ],
              },
            ],
          },
          {
            id: "files",
            label: "Files",
            fields: [
              {
                type: "file",
                key: "file1",
                label: "File (Single)",
                description: "File (Single)",
                dontAddToRecent: true,
              },
              {
                type: "file",
                key: "file2",
                label: "File (Multiple)",
                description: "File (Multiple)",
                multiSelections: true,
                dontAddToRecent: true,
              },
              {
                type: "file",
                key: "file3",
                label: "File (Filters)",
                description: "File (Filters)",
                filters: [
                  {
                    name: "Audio Files",
                    extensions: ["mp3", "wav", "ogg", "flac"],
                  },
                ],
                dontAddToRecent: true,
              },
            ],
          },
          {
            id: "lists",
            label: "Lists",
            fields: [
              {
                type: "list",
                key: "list1",
                label: "List (Non-orderable)",
                description: "List (Non-orderable)",
              },
              {
                type: "list",
                key: "list2",
                label: "List (Orderable)",
                orderable: true,
                description: "List (Orderable)",
              },
            ],
          },
          {
            id: "numbers",
            label: "Numbers",
            fields: [
              {
                type: "number",
                key: "number1",
                label: "Number (Unbounded)",
                description: "Number (Unbounded)",
              },
              {
                type: "number",
                key: "number2",
                label: "Number (Bounded)",
                min: 0,
                max: 10,
                description: "Number (Bounded)",
              },
              {
                type: "number",
                key: "number3",
                label: "Number (Decimal)",
                precision: 2,
                step: 0.1,
                min: 0,
                max: 10,
                description: "Number (Decimal)",
              },
            ],
          },
          {
            id: "radios",
            label: "Radios",
            fields: [
              {
                type: "radio",
                key: "radio1",
                label: "Radio",
                description: "Radio",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                ],
              },
            ],
          },
          {
            id: "sliders",
            label: "Sliders",
            fields: [
              {
                type: "slider",
                key: "slider1",
                label: "Slider (Unbounded)",
                description: "Slider (Unbounded)",
              },
              {
                type: "slider",
                key: "slider2",
                label: "Slider (Bounded)",
                min: 0,
                max: 10,
                description: "Slider (Bounded)",
              },
              {
                type: "slider",
                key: "slider3",
                label: "Slider (Decimal)",
                precision: 2,
                step: 0.1,
                min: 0,
                max: 10,
                description: "Slider (Decimal)",
              },
            ],
          },
          {
            id: "text",
            label: "Text",
            fields: [
              {
                type: "text",
                key: "text1",
                label: "Text",
                description: "Text",
              },
            ],
          },
        ],
      },
    },
    {
      id: "test2",
      label: "Testing",
      form: {
        groups: [
          {
            id: "accelerators",
            label: "Accelerators",
            fields: [
              {
                type: "accelerator",
                key: "accelerator1",
                label: "Accelerator (Normal)",
                description: "Accelerator (Normal)",
              } as SettingsAcceleratorField,
              {
                type: "accelerator",
                key: "accelerator2",
                label: "Accelerator (Modifier Required)",
                description: "Accelerator (Modifier Required)",
                modifierRequired: true,
              } as SettingsAcceleratorField,
              {
                type: "accelerator",
                key: "accelerator3",
                label: "Accelerator (Allow Only Modifier)",
                description: "Accelerator (Allow Only Modifier)",
                allowOnlyModifier: true,
              } as SettingsAcceleratorField,
            ],
          },
          {
            id: "checkboxes",
            label: "Checkboxes",
            fields: [
              {
                type: "checkbox",
                key: "checkbox1",
                label: "Checkbox (Single)",
                description: "Checkbox (Single)",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                ] as CheckboxOption[],
              },
              {
                type: "checkbox",
                key: "checkbox2",
                label: "Checkbox (Multiple)",
                description: "Checkbox (Multiple)",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                  {
                    label: "Option 3",
                    value: "option3",
                  },
                ] as CheckboxOption[],
              },
            ],
          },
          {
            id: "colors",
            label: "Colors",
            fields: [
              {
                type: "color",
                key: "color1",
                label: "Color (Hex)",
                description: "Color (Hex)",
                format: "hex",
              },
              {
                type: "color",
                key: "color2",
                label: "Color (RGB)",
                description: "Color (RGB)",
                format: "rgb",
              },
              {
                type: "color",
                key: "color3",
                label: "Color (HSL)",
                description: "Color (HSL)",
                format: "hsl",
              },
            ],
          },
          {
            id: "directories",
            label: "Directories",
            fields: [
              {
                type: "directory",
                key: "directory1",
                label: "Directory (Single)",
                description: "Directory (Single)",
                dontAddToRecent: true,
              },
              {
                type: "directory",
                key: "directory2",
                label: "Directory (Multiple)",
                description: "Directory (Multiple)",
                multiSelections: true,
                dontAddToRecent: true,
              },
            ],
          },
          {
            id: "dropdowns",
            label: "Dropdowns",
            fields: [
              {
                type: "dropdown",
                key: "dropdown1",
                label: "Dropdown",
                description: "Dropdown",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                  {
                    label: "Option 3",
                    value: "option3",
                  },
                ],
              },
            ],
          },
          {
            id: "files",
            label: "Files",
            fields: [
              {
                type: "file",
                key: "file1",
                label: "File (Single)",
                description: "File (Single)",
                dontAddToRecent: true,
              },
              {
                type: "file",
                key: "file2",
                label: "File (Multiple)",
                description: "File (Multiple)",
                multiSelections: true,
                dontAddToRecent: true,
              },
              {
                type: "file",
                key: "file3",
                label: "File (Filters)",
                description: "File (Filters)",
                filters: [
                  {
                    name: "Audio Files",
                    extensions: ["mp3", "wav", "ogg", "flac"],
                  },
                ],
                dontAddToRecent: true,
              },
            ],
          },
          {
            id: "lists",
            label: "Lists",
            fields: [
              {
                type: "list",
                key: "list1",
                label: "List (Non-orderable)",
                description: "List (Non-orderable)",
              },
              {
                type: "list",
                key: "list2",
                label: "List (Orderable)",
                orderable: true,
                description: "List (Orderable)",
              },
            ],
          },
          {
            id: "numbers",
            label: "Numbers",
            fields: [
              {
                type: "number",
                key: "number1",
                label: "Number (Unbounded)",
                description: "Number (Unbounded)",
              },
              {
                type: "number",
                key: "number2",
                label: "Number (Bounded)",
                min: 0,
                max: 10,
                description: "Number (Bounded)",
              },
              {
                type: "number",
                key: "number3",
                label: "Number (Decimal)",
                precision: 2,
                step: 0.1,
                min: 0,
                max: 10,
                description: "Number (Decimal)",
              },
            ],
          },
          {
            id: "radios",
            label: "Radios",
            fields: [
              {
                type: "radio",
                key: "radio1",
                label: "Radio",
                description: "Radio",
                options: [
                  {
                    label: "Option 1",
                    value: "option1",
                  },
                  {
                    label: "Option 2",
                    value: "option2",
                  },
                ],
              },
            ],
          },
          {
            id: "sliders",
            label: "Sliders",
            fields: [
              {
                type: "slider",
                key: "slider1",
                label: "Slider (Unbounded)",
                description: "Slider (Unbounded)",
              },
              {
                type: "slider",
                key: "slider2",
                label: "Slider (Bounded)",
                min: 0,
                max: 10,
                description: "Slider (Bounded)",
              },
              {
                type: "slider",
                key: "slider3",
                label: "Slider (Decimal)",
                precision: 2,
                step: 0.1,
                min: 0,
                max: 10,
                description: "Slider (Decimal)",
              },
            ],
          },
          {
            id: "text",
            label: "Text",
            fields: [
              {
                type: "text",
                key: "text1",
                label: "Text",
                description: "Text",
              },
            ],
          },
        ],
      },
    },
  ],
});

const menuTemplate: (Electron.MenuItem | Electron.MenuItemConstructorOptions)[] = [
  // { role: "fileMenu" },
  {
    label: "File",
    submenu: [
      {
        label: "Open File",
        accelerator: "CmdOrCtrl+O",
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
              await readFileAndSend(window, filePaths[0], false);
            }
          }
        },
      },
      {
        label: "Add Folder",
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
          });
          if (filePaths.length > 0) {
            const folderPaths: string[] = storeInstance.get("folderPaths", []) as string[];
            folderPaths.push(filePaths[0]);
            storeInstance.set("folderPaths", folderPaths);
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        click: async () => {
          await settingsWindow.show();
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        click: async () => {
          await dialog.showMessageBox({
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        click: async () => {
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

setupTitlebar();

async function createWindow(): Promise<void> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 767,
    height: 670,
    show: false,
    minWidth: 600,
    titleBarStyle: "hidden",
    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/main.js"),
      sandbox: false,
    },
  });
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // mainWindow.setMenu(Menu.buildFromTemplate(menuTemplate));
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
    shell
      .openExternal(details.url)
      .then(null)
      .catch((error: Error) => {
        console.error(error);
      });
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  }
  else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app
  .whenReady()
  .then(async () => {
    const folderPaths: string[] = storeInstance.get("folderPaths", []) as string[];
    if (folderPaths.length === 0) {
      const MusicPath = join(os.homedir(), "Music");
      if (fs.existsSync(MusicPath)) {
        folderPaths.push(MusicPath);
      }
      storeInstance.set("folderPaths", folderPaths);
    }
    // Install react devtools
    await devTools.install("REACT_DEVELOPER_TOOLS", { allowFileAccess: true });

    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    await createWindow();

    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().catch(console.error);
      }
    });
  })
  .catch((error) => {
    console.error(error);
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

ipcMain.handle("readDir", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    const files = fs.readdirSync(filePaths[0]);
    const tracksPromise = files.map(async (file) => {
      const buffer = fs.readFileSync(join(filePaths[0], file));
      const metadata = await parseBuffer(buffer, "audio/mpeg");
      return {
        artist: metadata.common.artist ?? "",
        id: randomUUID(),
        album: metadata.common.album ?? "",
        name: metadata.common.title ?? "",
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        storage_location: join(filePaths[0], file),
      };
    });

    const tracks = await Promise.all(tracksPromise);
    console.log(tracks);
  }
});

ipcMain.handle("loadAudioFile", async (_, file: string, play: boolean) => {
  const window = BrowserWindow.getAllWindows()[0];
  if (window) {
    await readFileAndSend(window, file, play);
  }
});

ipcMain.handle("getStoreKey", (_, key) => {
  return storeInstance.get(key);
});

ipcMain.handle("setStoreKey", (_, key: string, value, subkey: string) => {
  storeInstance.set(key, value);
  if (key === "settings" && subkey) {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("storeKeyUpdated", subkey, value);
    }
  }
  else {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send("storeKeyUpdated", key, value);
    }
  }
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
