import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent, OpenDialogSyncOptions, webContents } from "electron";
import EventEmitter from "eventemitter3";
import fs from "fs";
import { is } from "@electron-toolkit/utils";
import lodash from "lodash";
import log from "electron-log";
import path from "path";
import { SettingsSection } from "@/types";
type SettingsWindowConfig = {
  sections?: SettingsSection[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaults?: { [key: string]: any };
};

export default class SettingsWindow extends EventEmitter {
  options = {} as SettingsWindowConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
  _preferences = {} as { [key: string]: any };
  dataStore = `${app.getPath("userData")}/settings.json`;

  get preferences() {
    return this._preferences;
  }

  set preferences(value) {
    this._preferences = value;
  }

  constructor(options: SettingsWindowConfig) {
    super();
    lodash.defaultsDeep(options, {
      sections: [],
    });
    if (options.sections) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      for (const [_key, section] of options.sections.entries()) {
        lodash.defaultsDeep(section, {
          form: {
            groups: [],
          },
        });
      }
    }

    this.options = options;

    try {
      if (fs.existsSync(this.dataStore)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.preferences = JSON.parse(fs.readFileSync(this.dataStore, "utf8")) as { [key: string]: any };
      }
    }
    catch (error) {
      log.error(error);
      this.preferences = {};
    }

    if (this.preferences) {
      for (const prefDefaultGroups of lodash.keys(this.defaults)) {
        if (prefDefaultGroups in this.preferences) {
          for (const prefDefault of lodash.keys(this.defaults[prefDefaultGroups])) {
            if (prefDefault in this.preferences[prefDefaultGroups]) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              this.preferences[prefDefaultGroups][prefDefault] = {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ...this.defaults[prefDefaultGroups][prefDefault],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ...this.preferences[prefDefaultGroups][prefDefault],
              };
            }
            else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              this.preferences[prefDefaultGroups][prefDefault] = this.defaults[prefDefaultGroups][prefDefault];
            }
          }
        }
        else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.preferences[prefDefaultGroups] = this.defaults[prefDefaultGroups];
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
      event.returnValue = JSON.stringify(this.options.sections);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ipcMain.on("setPreferences", (event: IpcMainEvent, value: { [key: string]: any }) => {
      this.preferences = value;
      this.save();
      this.broadcast();
      this.emit("save", Object.freeze(lodash.cloneDeep(this.preferences)));
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
    return lodash.cloneDeep(this.options.defaults || {});
  }

  save() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderedPrefs = {} as { [key: string]: any };
    for (const key of Object.keys(this.preferences)) {
      if (this.preferences[key] !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const subPrefs = this.preferences[key];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const ordered = Object.keys(subPrefs)
          // eslint-disable-next-line no-undefined
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
          .reduce((obj, key) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            obj[key] = subPrefs[key];
            return obj;
          }, {});
        orderedPrefs[key] = ordered;
      }
    }

    const prefString = JSON.stringify(orderedPrefs, null, 4);
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
      show: true,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "../preload/settings.mjs"),
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
          log.warn(`Could not find a section with id '${section}'. Ignoring the parameter`);
          section = "";
        }
      }
    }

    const prefsWindow = new BrowserWindow(this.getBrowserWindowOptions());
    prefsWindow.removeMenu();

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      await prefsWindow.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/settings.html`);
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
          log.error(`Could not open the requested section ${section}:`, error);
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
