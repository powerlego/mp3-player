import React from "react";
import useDarkMode from "@renderer/hooks/useDarkMode";
import SettingsButton from "@renderer/components/Settings/SettingsButton/";

export default function Settings(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [darkTheme, setDarkTheme] = useDarkMode();
  return (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-[4.5rem] bg-gray-300 dark:bg-[#1f2123] text-gray-800 dark:text-white flex flex-col">
        <span className="text-2xl font-bold">Main</span>
        <span className="text-2xl font-bold">Dark theme: {darkTheme ? "true" : "false"}</span>
      </div>
      <div className="absolute bottom-8 left-0 right-0 h-10 bg-gray-350 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-row justify-end items-center">
        <div className="flex flex-row justify-between gap-2 mr-2">
          <SettingsButton onClick={() => window.close()}>
            <span className="text-sm">Cancel</span>
          </SettingsButton>
          <SettingsButton>
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
