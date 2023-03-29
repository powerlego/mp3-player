import { app, BrowserWindow, ipcMain, IpcMainEvent, webContents, dialog, OpenDialogSyncOptions } from "electron";
import { EventEmitter2 } from "eventemitter2";
import _ from "lodash";
import fs from "fs";
import path from "path";
import jsonSerializer from "serialize-javascript";
import { SettingsSection } from "@/types";
import { is } from "@electron-toolkit/utils";

type SettingsWindowConfig = {
  sections?: SettingsSection[];
  defaults?: { [key: string]: any };
};

export default class SettingsWindow extends EventEmitter2 {
  options = {} as SettingsWindowConfig;
  _preferences = {} as { [key: string]: any };
  dataStore = app.getPath("userData") + "/settings.json";

  get preferences() {
    return this._preferences;
  }

  set preferences(value) {
    this._preferences = value;
  }

  constructor(options: SettingsWindowConfig) {
    super();

    _.defaultsDeep(options, {
      sections: [],
    });
    if (options.sections) {
      for (const [sectionId, section] of options.sections.entries()) {
        _.defaultsDeep(section, {
          form: {
            groups: [],
          },
        });

        section.form.groups = section.form.groups.map((group, groupIdx) => {
          group.id = `group${sectionId}${groupIdx}`;
          return group;
        });
      }
    }
    this.options = options;

    try {
      if (fs.existsSync(this.dataStore)) {
        this.preferences = JSON.parse(fs.readFileSync(this.dataStore, "utf8")) as { [key: string]: any };
      }
    }
    catch (error: any) {
      console.error(error);
      this.preferences = {};
    }

    if (this.preferences) {
      for (const prefDefault of _.keys(this.defaults)) {
        if (prefDefault in this.preferences) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.preferences[prefDefault] = { ...this.defaults[prefDefault], ...this.preferences[prefDefault] };
        }
        else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.preferences[prefDefault] = this.defaults[prefDefault];
        }
      }
    }
    else {
      this.preferences = this.defaults;
    }

    this.save();

    ipcMain.on("showPreferences", (_: IpcMainEvent, section: string) => {
      this.show(section).catch(console.error);
    });

    ipcMain.on("getSections", (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      event.returnValue = jsonSerializer(this.options.sections);
    });

    ipcMain.on("restoreDefaults", () => {
      this.preferences = this.defaults;
      this.save();
      this.broadcast();
    });

    ipcMain.on("getDefaults", (event) => {
      event.returnValue = this.defaults;
    });

    ipcMain.on("getPreferences", (event) => {
      event.returnValue = this.preferences;
    });

    ipcMain.on("setPreferences", (event: IpcMainEvent, value: { [key: string]: any }) => {
      this.preferences = value;
      this.save();
      this.broadcast();
      this.emit("save", Object.freeze(_.cloneDeep(this.preferences)));
      event.returnValue = null;
    });

    ipcMain.on("showOpenDialog", (event, dialogOptions: OpenDialogSyncOptions) => {
      event.returnValue = dialog.showOpenDialogSync(dialogOptions);
    });

    ipcMain.on("sendButtonClick", (_, message) => {
      // Main process
      this.emit("click", message);
    });

    ipcMain.on("resetToDefaults", () => {
      this.resetToDefaults();
    });
  }

  get defaults() {
    return _.cloneDeep(this.options.defaults || {});
  }

  save() {
    const prefString = JSON.stringify(this.preferences, null, 4);
    fs.writeFileSync(this.dataStore, prefString, "utf8");
  }

  broadcast() {
    for (const wc of webContents.getAllWebContents()) {
      wc.send("preferencesUpdated", this.preferences);
    }
  }

  getBrowserWindowOptions() {
    const parentWindow = BrowserWindow.getAllWindows()[0];
    const browserWindowOptions = {
      parent: parentWindow,
      modal: true,
      title: "Preferences",
      width: 800,
      maxWidth: 800,
      height: 600,
      maxHeight: 600,
      resizable: false,
      acceptFirstMouse: true,
      maximizable: false,
      show: false,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "../preload/settings.js"),
        sandbox: false,
      },
    } as Electron.BrowserWindowConstructorOptions;

    return browserWindowOptions;
  }

  async show(section?: string) {
    if (typeof section !== "undefined") {
      if (this.options.sections) {
        const sectionIds = this.options.sections.map((section) => section.id);
        if (!sectionIds.includes(section)) {
          console.warn(`Could not find a section with id '${section}'. Ignoring the parameter`);
          section = "";
        }
      }
    }

    const prefsWindow = new BrowserWindow(this.getBrowserWindowOptions());
    prefsWindow.removeMenu();

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      await prefsWindow.loadURL(process.env["ELECTRON_RENDERER_URL"] + "/settings.html");
      prefsWindow.webContents.openDevTools();
    }
    else {
      await prefsWindow.loadFile(path.join(__dirname, "../renderer/settings.html"));
    }

    prefsWindow.on("ready-to-show", () => {
      // Show: false by default, then show when ready to prevent page "flicker"
      prefsWindow.show();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    prefsWindow.webContents.on("dom-ready", async () => {
      if (section) {
        try {
          await prefsWindow.webContents.executeJavaScript(`document.getElementById("tab-${section}").click();0`); // ";0" is needed so nothing is returned (especially not an non-cloneable IPC object) by JS.
        }
        catch (error) {
          console.error(`Could not open the requested section ${section}:`, error);
        }
      }
    });

    return prefsWindow;
  }

  resetToDefaults() {
    this._preferences = this.defaults;

    this.save();
    this.broadcast();
  }
}
