import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Titlebar } from "custom-electron-titlebar";
import { FilePayload } from "@/types";

window.addEventListener("DOMContentLoaded", () => {
  const titleBar = new Titlebar({
    containerOverflow: "hidden",
  });
  titleBar._title.classList.remove("cet-center");
  titleBar._title.style.removeProperty("max-width");
  const replaceText = (selector: string, text: string | undefined) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text ?? "";
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// Custom APIs for renderer
const api = {
  onFileOpen: (callback: (_event: Electron.IpcRendererEvent, file: FilePayload, play: boolean) => void) =>
    ipcRenderer.on("open-file", callback),
  getAudioFile: () => ipcRenderer.invoke("getAudioFile"),
  loadAudioFile: (file: string, play: boolean) => ipcRenderer.invoke("loadAudioFile", file, play),
  getStoreKey: (key: string) => ipcRenderer.invoke("getStoreKey", key),
  setStoreKey: (key: string, value: any) => ipcRenderer.invoke("setStoreKey", key, value),
  getAudioInfo: (file: string) =>
    ipcRenderer.invoke("getAudioInfo", file) as Promise<{
      title: string;
      artist: string;
      pictureBase64: string;
      pictureFormat: string;
    }>,
  offFileOpen: (callback: (_event: Electron.IpcRendererEvent, file: FilePayload, play: boolean) => void) =>
    ipcRenderer.removeListener("open-file", callback),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
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
}
