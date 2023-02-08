import { ElectronAPI } from "@electron-toolkit/preload";
import { IAudioMetadata } from "music-metadata/lib/type";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onFileOpen: (
        callback: (
          _event: any,
          file: {
            metadata: IAudioMetadata;
            uint8Array: Uint8Array;
          }
        ) => void
      ) => Electron.IpcRenderer;
      getAudioFile: () => Promise<string>;
      loadAudioFile: () => Promise<string>;
      getStoreKey: (key: string) => Promise<any>;
      setStoreKey: (key: string, value: any) => Promise<any>;
    };
  }
}
