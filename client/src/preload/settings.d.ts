import { SettingsSection } from "@/types";

declare global {
  interface Window {
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
