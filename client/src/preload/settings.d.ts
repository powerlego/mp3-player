import { SettingsSection } from "@/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getStoreKey: (key: string) => Promise<any>;
      setStoreKey: (key: string, value: any, subkey?: string) => Promise<any>;
      on: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
      off: (channel: string, listener: (...args: any[]) => void) => Electron.IpcRenderer;
    };
    settings: {
      getSections: () => SettingsSection[];
      getPreferences: () => { [key: string]: any };
      getDefaults: () => { [key: string]: any };
      setPreferences: (preferences: any) => void;
      showOpenDialog: (dialogOptions: Electron.OpenDialogSyncOptions) => Electron.OpenDialogReturnValue;
      sendButtonClick: (channel: string) => void;
    };
  }
}
