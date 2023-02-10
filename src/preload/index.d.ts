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
            picture: {
              base64: string;
              format: string;
            };
          }
        ) => void
      ) => Electron.IpcRenderer;
      getAudioFile: () => Promise<string>;
      loadAudioFile: (file: string) => Promise<string>;
      getStoreKey: (key: string) => Promise<any>;
      setStoreKey: (key: string, value: any) => Promise<any>;
      getAudioInfo: (file: string) => Promise<{
        title: string;
        artist: string;
        pictureBase64: string;
        pictureFormat: string;
      }>;
    };
  }
}
