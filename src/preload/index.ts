/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import electronTitlebar from "custom-electron-titlebar";

const { Titlebar, TitlebarColor } = electronTitlebar;

window.addEventListener("DOMContentLoaded", () => {
  new Titlebar({
    // menu,
    containerOverflow: "hidden",
    backgroundColor: TitlebarColor.BLACK,
    titleHorizontalAlignment: "center",
  });
});

// Custom APIs for renderer
const api = {
  getAudioFile: () => ipcRenderer.invoke("getAudioFile"),
  loadAudioFile: (file: string, play: boolean) => ipcRenderer.invoke("loadAudioFile", file, play),
  readDir: () => ipcRenderer.invoke("readDir"),
  getStoreKey: (key: string) => ipcRenderer.invoke("getStoreKey", key),
  setStoreKey: (key: string, value: any, subkey: string) => ipcRenderer.invoke("setStoreKey", key, value, subkey),
  getAudioInfo: (file: string) =>
    ipcRenderer.invoke("getAudioInfo", file) as Promise<{
      title: string;
      artist: string;
      pictureBase64: string;
      pictureFormat: string;
    }>,
  on: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.on(channel, listener),
  off: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
};

const settings = {
  getPreferences: (): { [key: string]: any } => ipcRenderer.sendSync("getPreferences") as { [key: string]: any },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("settings", settings);
  }
  catch (error) {
    console.error(error);
  }
}
else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.settings = settings;
}
