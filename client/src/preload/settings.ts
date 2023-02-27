import { SettingsSection } from "@/types";
import { contextBridge, ipcRenderer, OpenDialogReturnValue, OpenDialogSyncOptions } from "electron";
import { Titlebar } from "custom-electron-titlebar";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const deserializeJson = (serializedJavascript: string) => eval("(" + serializedJavascript + ")");

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

const settings = {
  getSections: (): SettingsSection[] =>
    deserializeJson(ipcRenderer.sendSync("getSections") as string) as SettingsSection[],
  getPreferences: (): { [key: string]: any } => ipcRenderer.sendSync("getPreferences") as { [key: string]: any },
  getDefaults: (): { [key: string]: any } => ipcRenderer.sendSync("getDefaults") as { [key: string]: any },
  setPreferences: (preferences: any) => ipcRenderer.send("setPreferences", preferences),
  showOpenDialog: (dialogOptions: OpenDialogSyncOptions): OpenDialogReturnValue =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ipcRenderer.sendSync("showOpenDialog", dialogOptions),
  sendButtonClick: (channel: string) => ipcRenderer.send("sendButtonClick", channel),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("settings", settings);
  }
  catch (error) {
    console.error("contextBridge.exposeInMainWorld() failed:", error);
  }
}
else {
  // @ts-ignore (define in dts)
  window.settings = settings;
}
