import React from "react";
import useDarkMode from "@renderer/hooks/useDarkMode";

import SettingsWindow from "./SettingsWindow";

export default function Settings(): JSX.Element {
  useDarkMode();

  return <SettingsWindow />;
}
