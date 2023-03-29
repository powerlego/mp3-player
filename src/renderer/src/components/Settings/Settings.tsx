import React from "react";
import useDarkMode from "@renderer/hooks/useDarkMode";
import SettingsButton from "@renderer/components/Settings/SettingsButton/";
import SettingsWindow from "./SettingsWindow";

const allSections = window.settings.getSections();
const preferencesG = window.settings.getPreferences();

export default function Settings(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [darkTheme, setDarkTheme] = useDarkMode();
  const [activeSection, __] = React.useState(allSections[0].id);
  const [sections, _] = React.useState(allSections);
  const [preferences, setPreferences] = React.useState(preferencesG);

  const onFieldChange = (key: string, value: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    preferences[activeSection][key] = value;
    setPreferences(preferences);

    window.settings.setPreferences(preferences);
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-[4.5rem] bg-gray-300 dark:bg-[#1f2123] text-gray-800 dark:text-white flex flex-col">
        <SettingsWindow
          activeSection={sections[0].id}
          preferences={preferences}
          sections={sections}
          onFieldChange={onFieldChange}
        />
      </div>
      <div className="absolute bottom-8 left-0 right-0 h-10 bg-gray-350 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-row justify-end items-center">
        <div className="flex flex-row justify-between gap-2 mr-2">
          <SettingsButton onClick={() => window.close()}>
            <span className="text-sm">Cancel</span>
          </SettingsButton>
          <SettingsButton onClick={() => console.log(window.settings.getSections())}>
            <span className="text-sm">Apply</span>
          </SettingsButton>
          <SettingsButton>
            <span className="text-sm">Save & Close</span>
          </SettingsButton>
        </div>
      </div>
    </>
  );
}
