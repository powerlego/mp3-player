/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

window.addEventListener("DOMContentLoaded", () => {});

// Custom APIs for renderer
const api = {
  getAudioFile: () => ipcRenderer.invoke("getAudioFile"),
  getStoreKey: (key: string) => ipcRenderer.invoke("getStoreKey", key),
  setStoreKey: (key: string, value: any) => ipcRenderer.invoke("setStoreKey", key, value),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
