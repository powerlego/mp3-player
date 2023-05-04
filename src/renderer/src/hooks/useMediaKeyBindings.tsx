/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import { MediaControlKeyBindings } from "@/types";

function useMediaKeyBindings() {
  const [keyBindings, setKeyBindings] = useState({
    playPause: "Space",
    jumpBackward: "Left",
    jumpForward: "Right",
    volumeUp: "Up",
    volumeDown: "Down",
    mute: "M",
    repeat: "R",
    shuffle: "S",
  });

  useEffect(() => {
    const preferences = window.settings.getPreferences();
    if (preferences["keyBindings"]) {
      if (preferences["keyBindings"]["mediaControl"]) {
        setKeyBindings(preferences["keyBindings"]["mediaControl"] as MediaControlKeyBindings);
      }
    }
  }, []);

  useEffect(() => {
    window.api.on("preferencesUpdated", (_: Electron.IpcRendererEvent, preferences: any) => {
      if (preferences["keyBindings"]) {
        if (preferences["keyBindings"]["mediaControl"]) {
          setKeyBindings(preferences["keyBindings"]["mediaControl"] as MediaControlKeyBindings);
        }
      }
    });
    return () => {
      window.api.off("preferencesUpdated", (_: Electron.IpcRendererEvent, preferences: any) => {
        if (preferences["keyBindings"]) {
          if (preferences["keyBindings"]["mediaControl"]) {
            setKeyBindings(preferences["keyBindings"]["mediaControl"] as MediaControlKeyBindings);
          }
        }
      });
    };
  });

  return [keyBindings];
}

export default useMediaKeyBindings;
