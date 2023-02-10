/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Titlebar } from "custom-electron-titlebar";
import { IAudioMetadata } from "music-metadata/lib/type";

window.addEventListener("DOMContentLoaded", () => {
  const titleBar = new Titlebar({
    containerOverflow: "hidden",
  });
  titleBar._title.classList.remove("cet-center");
  titleBar._title.style.removeProperty("max-width");
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// Custom APIs for renderer
const api = {
  onFileOpen: (
    callback: (
      _event,
      file: {
        metadata: IAudioMetadata;
        uint8Array: Uint8Array;
        picture: {
          base64: string;
          format: string;
        };
      }
    ) => void
  ) => ipcRenderer.on("open-file", callback),
  getAudioFile: () => ipcRenderer.invoke("getAudioFile"),
  loadAudioFile: (file: string) => ipcRenderer.invoke("loadAudioFile", file),
  getStoreKey: (key: string) => ipcRenderer.invoke("getStoreKey", key),
  setStoreKey: (key: string, value: any) => ipcRenderer.invoke("setStoreKey", key, value),
  getAudioInfo: (file: string) =>
    ipcRenderer.invoke("getAudioInfo", file) as Promise<{
      title: string;
      artist: string;
      pictureBase64: string;
      pictureFormat: string;
    }>,
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
