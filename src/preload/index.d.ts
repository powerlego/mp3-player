/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElectronAPI } from "@electron-toolkit/preload";
import { Settings } from "@/types";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAudioFile: () => Promise<string>;
      readDir: () => Promise<void>;
      loadAudioFile: (file: string, play: boolean) => Promise<string>;
      getStoreKey: (key: string) => Promise<any>;
      setStoreKey: (key: string, value: any, subkey: string) => Promise<any>;
      getAudioInfo: (file: string) => Promise<{
        title: string;
        artist: string;
        pictureBase64: string;
        pictureFormat: string;
      }>;
      on: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
      off: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
    };
    settings: {
      getPreferences: () => { [key: string]: any };
      getSections: () => SettingsSection[];
      getDefaults: () => { [key: string]: any };
      setPreferences: (preferences: { [key: string]: any }) => void;
      showOpenDialog: (dialogOptions: Electron.OpenDialogSyncOptions) => string[] | undefined;
      sendButtonClick: (channel: string) => void;
    };
  }
}
