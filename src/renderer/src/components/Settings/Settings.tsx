import React from "react";
import useDarkMode from "@renderer/hooks/useDarkMode";

import SettingsWindow from "./SettingsWindow";

export default function Settings(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [darkTheme, setDarkTheme] = useDarkMode();

  return <SettingsWindow />;
}
