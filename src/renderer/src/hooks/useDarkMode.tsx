/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const preferences = window.settings.getPreferences();
    const className = "dark";
    const bodyClass = window.document.body.classList;
    if (preferences["ui"]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (preferences["ui"]["theme"] === "dark") {
        bodyClass.add(className);
        setDarkTheme(true);
      }
      else {
        bodyClass.remove(className);
        setDarkTheme(false);
      }
    }
  }, []);

  useEffect(() => {
    window.api.on("preferencesUpdated", (_: Electron.IpcRendererEvent, preferences: any) => {
      const className = "dark";
      const bodyClass = window.document.body.classList;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (preferences["ui"]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (preferences["ui"]["theme"] === "dark") {
          bodyClass.add(className);
          setDarkTheme(true);
        }
        else {
          bodyClass.remove(className);
          setDarkTheme(false);
        }
      }
    });
    return () => {
      window.api.off("preferencesUpdated", (_: Electron.IpcRendererEvent, preferences: any) => {
        const className = "dark";
        const bodyClass = window.document.body.classList;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (preferences["ui"]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (preferences["ui"]["theme"] === "dark") {
            bodyClass.add(className);
            setDarkTheme(true);
          }
          else {
            bodyClass.remove(className);
            setDarkTheme(false);
          }
        }
      });
    };
  });
  return [darkTheme];
};

export default useDarkMode;
