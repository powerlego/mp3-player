import { onMounted, onUnmounted, ref } from "vue";

export function useDarkMode() {
  const darkTheme = ref(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handlePreferencesUpdated(_event: Electron.IpcRendererEvent, preferences: { [key: string]: any }) {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    if (preferences["ui"]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (preferences["ui"]["themes"]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (preferences["ui"]["themes"]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
