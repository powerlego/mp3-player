import { onMounted, onUnmounted, ref } from "vue";
import { Settings } from "@/types";

export function useDarkMode() {
  const darkTheme = ref(false);

  function handlePreferencesUpdated(_event: Electron.IpcRendererEvent, preferences: Settings) {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    if (preferences["ui"]) {
      if (preferences["ui"]["themes"]) {
        if (preferences["ui"]["themes"]["theme"] === "dark") {
          bodyClass.add(className);
          darkTheme.value = true;
        }
        else {
          bodyClass.remove(className);
          darkTheme.value = false;
        }
      }
    }
  }

  onMounted(() => {
    const preferences = window.settings.getPreferences();
    const className = "dark";
    const bodyClass = window.document.body.classList;
    if (preferences["ui"]) {
      if (preferences["ui"]["themes"]) {
        if (preferences["ui"]["themes"]["theme"] === "dark") {
          bodyClass.add(className);
          darkTheme.value = true;
        }
        else {
          bodyClass.remove(className);
          darkTheme.value = false;
        }
      }
    }
    window.api.on("preferencesUpdated", handlePreferencesUpdated);
  });

  onUnmounted(() => {
    window.api.off("preferencesUpdated", handlePreferencesUpdated);
  });

  return darkTheme;
}
