/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer, OpenDialogSyncOptions } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { SettingsSection } from "@/types";

const api = {
  getStoreKey: (key: string) => ipcRenderer.invoke("getStoreKey", key),
  setStoreKey: (key: string, value: any, subkey?: string) => ipcRenderer.invoke("setStoreKey", key, value, subkey),
  on: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.on(channel, listener),
  off: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.off(channel, listener),
};

const settings = {
  getSections: (): SettingsSection[] => JSON.parse(ipcRenderer.sendSync("getSections") as string) as SettingsSection[],
  getPreferences: (): { [key: string]: any } => ipcRenderer.sendSync("getPreferences") as { [key: string]: any },
  getDefaults: (): { [key: string]: any } => ipcRenderer.sendSync("getDefaults") as { [key: string]: any },
  setPreferences: (preferences: { [key: string]: any }) => ipcRenderer.send("setPreferences", preferences),
  showOpenDialog: (dialogOptions: OpenDialogSyncOptions): string[] | undefined =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ipcRenderer.sendSync("showOpenDialog", dialogOptions),
  sendButtonClick: (channel: string) => ipcRenderer.send("sendButtonClick", channel),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("settings", settings);
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  }
  catch (error) {
    console.error("contextBridge.exposeInMainWorld() failed:", error);
  }
}
else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.settings = settings;
  // @ts-ignore (define in dts)
  window.api = api;
}
