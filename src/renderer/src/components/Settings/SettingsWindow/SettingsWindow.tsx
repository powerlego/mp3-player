import { SettingsSection } from "@/types";
import React from "react";
import debounce from "@utils/debounce";
import SettingsMainWindow from "../SettingsMainWindow";

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
        <SettingsMainWindow {...this.state} onFieldChange={this.onFieldChange.bind(this)} />
      </>
    );
  }

  onFieldChange(key: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    preferences[this.state.activeSection][key] = value;

    this.setState({
      preferences,
    });

    dSavePreferences(preferences);
  }
}
