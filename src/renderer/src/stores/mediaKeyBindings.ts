
import { altKeyName, codeToChar, metaKeyName, specialKeyCodes } from "@renderer/constants";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useMediaKeyBindings = defineStore("mediaKeyBindings", () => {
  const keyBindings = reactive({
    playPause: "Space",
    jumpBackward: "Left",
    jumpForward: "Right",
    volumeUp: "Up",
    volumeDown: "Down",
    mute: "M",
    repeat: "R",
    shuffle: "S",
  });

  function combineKeyCodes(event: KeyboardEvent) {
    const keys = [
      event.ctrlKey && "Ctrl",
      event.metaKey && metaKeyName,
      event.altKey && altKeyName,
      event.shiftKey && "Shift",
    ].filter(Boolean) as string[];

    if (!specialKeyCodes.has(event.code) && event.code in codeToChar) {
      keys.push(codeToChar[event.code]);
      return keys.join("+");
    }
    return "";
  }

  return { keyBindings, combineKeyCodes };
});
