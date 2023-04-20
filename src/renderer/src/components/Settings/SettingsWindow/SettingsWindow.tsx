import { SettingsSection } from "@/types";
import React from "react";
import debounce from "@utils/debounce";
import SettingsMainWindow from "../SettingsMainWindow";
import SettingsButton from "@renderer/components/Settings/SettingsButton/";
import SettingsSidebar from "../SettingsSidebar/SettingsSidebar";

const dSavePreferences = debounce((preferences) => {
  window.settings.setPreferences(preferences);
}, 200);

type SettingsWindowState = {
  activeSection: string;
  sections: SettingsSection[];
  preferences: { [key: string]: any };
  oldPreferences: { [key: string]: any };
};

export default class SettingsWindow extends React.Component<Record<string, never>, SettingsWindowState> {
  constructor(props: Record<string, never>) {
    super(props);
    const allSections: SettingsSection[] = window.settings.getSections() as SettingsSection[];
    const preferences = window.settings.getPreferences();
    for (const section of allSections) {
      if (!preferences[section.id]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        preferences[section.id] = {};
      }
    }

    this.state = {
      activeSection: (allSections[0]).id,
      sections: allSections,
      preferences,
      oldPreferences: structuredClone(preferences) as { [key: string]: any },
    };
  }

  isDifferentPreferences = (a: { [key: string]: any }, b: { [key: string]: any }) => {
    for (const key of Object.keys(a)) {
      if (!(key in b)) {
        return true;
      }
      if (typeof a[key] === "object") {
        if (Array.isArray(a[key])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (a[key].length !== b[key].length) {
            return true;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          for (let i = 0; i < a[key].length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (a[key][i] !== b[key][i]) {
              return true;
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (this.isDifferentPreferences(a[key], b[key])) {
          return true;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      else if (a[key] !== b[key]) {
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <>
        <div className="absolute top-0 left-0 right-0 bottom-[4.5rem] bg-gray-180 dark:bg-gray-860 text-gray-800 dark:text-white flex flex-row">
          <SettingsSidebar {...this.state} onSelectSection={this.onSelectSection.bind(this)} />
          <SettingsMainWindow {...this.state} onFieldChange={this.onFieldChange.bind(this)} />
        </div>
        <div className="absolute bottom-8 left-0 right-0 h-10 bg-gray-220 dark:bg-gray-880 text-gray-800 dark:text-white flex flex-row justify-end items-center">
          <div className="flex flex-row justify-between gap-2 mr-2">
            <SettingsButton onClick={() => window.close()}>
              <span className="text-sm">Cancel</span>
            </SettingsButton>
            <SettingsButton
              enabled={this.isDifferentPreferences(this.preferences, this.state.oldPreferences)}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await dSavePreferences(this.preferences);
                this.setState({
                  oldPreferences: structuredClone(this.preferences) as { [key: string]: any },
                });
              }}
            >
              <span className="text-sm">Apply</span>
            </SettingsButton>
            <SettingsButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await dSavePreferences(this.preferences);
                window.close();
              }}
            >
              <span className="text-sm">Save & Close</span>
            </SettingsButton>
          </div>
        </div>
      </>
    );
  }
  get preferences() {
    return this.state.preferences;
  }

  onSelectSection(sectionId: string) {
    this.setState({
      activeSection: sectionId,
    });
  }

  onFieldChange(key: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.preferences[this.state.activeSection][key] = value;

    this.setState({
      preferences: this.preferences,
    });

    // dSavePreferences(preferences);
  }
}
