import { SettingsSection } from "@/types";
import React from "react";
import debounce from "@utils/debounce";
import SettingsMainWindow from "../SettingsMainWindow";
import SettingsButton from "@renderer/components/Settings/SettingsButton/";

const allSections = window.settings.getSections();
const preferences = window.settings.getPreferences();

const dSavePreferences = debounce((preferences) => {
  window.settings.setPreferences(preferences);
}, 200);

type SettingsWindowState = {
  activeSection: string;
  sections: SettingsSection[];
  preferences: { [key: string]: any };
};

for (const section of allSections) {
  if (!preferences[section.id]) {
    preferences[section.id] = {};
  }
}

export default class SettingsWindow extends React.Component<Record<string, never>, SettingsWindowState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      activeSection: allSections[0].id,
      sections: allSections,
      preferences,
    };
  }

  render() {
    return (
      <>
        <div className="absolute top-0 left-0 right-0 bottom-[4.5rem] bg-gray-180 dark:bg-gray-860 text-gray-800 dark:text-white flex flex-col">
          <SettingsMainWindow {...this.state} onFieldChange={this.onFieldChange.bind(this)} />
        </div>
        <div className="absolute bottom-8 left-0 right-0 h-10 bg-gray-220 dark:bg-gray-880 text-gray-800 dark:text-white flex flex-row justify-end items-center">
          <div className="flex flex-row justify-between gap-2 mr-2">
            <SettingsButton onClick={() => window.close()}>
              <span className="text-sm">Cancel</span>
            </SettingsButton>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises*/}
            <SettingsButton onClick={() => dSavePreferences(preferences)}>
              <span className="text-sm">Apply</span>
            </SettingsButton>
            <SettingsButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await dSavePreferences(preferences);
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

  onFieldChange(key: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    preferences[this.state.activeSection][key] = value;

    this.setState({
      preferences,
    });

    // dSavePreferences(preferences);
  }
}
