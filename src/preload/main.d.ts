import { ElectronAPI } from "@electron-toolkit/preload";
import { FilePayload } from "@/types";
import { IpcRendererEvent } from "electron";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onFileOpen: (
        callback: (_event: IpcRendererEvent, file: FilePayload, play: boolean) => void
      ) => Electron.IpcRenderer;
      getAudioFile: () => Promise<string>;
      loadAudioFile: (file: string, play: boolean) => Promise<string>;
      getStoreKey: (key: string) => Promise<any>;
      setStoreKey: (key: string, value: any, subkey: string) => Promise<any>;
      getAudioInfo: (file: string) => Promise<{
        title: string;
        artist: string;
        pictureBase64: string;
        pictureFormat: string;
      }>;
      offFileOpen: (
        callback: (_event: IpcRendererEvent, file: FilePayload, play: boolean) => void
      ) => Electron.IpcRenderer;
      on: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
      off: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
    };
    settings: {
      getPreferences: () => { [key: string]: any };
    };
  }
}
