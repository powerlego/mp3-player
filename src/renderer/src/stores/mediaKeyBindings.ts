/* eslint-disable @typescript-eslint/naming-convention */
import { reactive } from "vue";

export function useMediaKeyBindings() {
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

  const codeToChar = {
    Backspace: "Backspace",
    Tab: "Tab",
    Enter: "Enter",
    ShiftLeft: "Shift",
    ShiftRight: "Shift",
    ControlLeft: "Ctrl",
    ControlRight: "Ctrl",
    AltLeft: "Alt",
    AltRight: "Alt",
    Pause: "Pause",
    CapsLock: "CapsLock",
    Escape: "Esc",
    Space: "Space",
    PageUp: "Page Up",
    PageDown: "Page Down",
    End: "End",
    Home: "Home",
    ArrowLeft: "Left",
    ArrowUp: "Up",
    ArrowRight: "Right",
    ArrowDown: "Down",
    F13: "PrtSc",
    Insert: "Insert",
    Delete: "Delete",
    Digit0: "0",
    Digit1: "1",
    Digit2: "2",
    Digit3: "3",
    Digit4: "4",
    Digit5: "5",
    Digit6: "6",
    Digit7: "7",
    Digit8: "8",
    Digit9: "9",
    KeyA: "A",
    KeyB: "B",
    KeyC: "C",
    KeyD: "D",
    KeyE: "E",
    KeyF: "F",
    KeyG: "G",
    KeyH: "H",
    KeyI: "I",
    KeyJ: "J",
    KeyK: "K",
    KeyL: "L",
    KeyM: "M",
    KeyN: "N",
    KeyO: "O",
    KeyP: "P",
    KeyQ: "Q",
    KeyR: "R",
    KeyS: "S",
    KeyT: "T",
    KeyU: "U",
    KeyV: "V",
    KeyW: "W",
    KeyX: "X",
    KeyY: "Y",
    KeyZ: "Z",
    MetaLeft: "MetaLeft",
    MetaRight: "MetaRight",
    ContextMenu: "ContextMenu",
    Numpad0: "Num0",
    Numpad1: "Num1",
    Numpad2: "Num2",
    Numpad3: "Num3",
    Numpad4: "Num4",
    Numpad5: "Num5",
    Numpad6: "Num6",
    Numpad7: "Num7",
    Numpad8: "Num8",
    Numpad9: "Num9",
    NumpadAdd: "Num+",
    NumpadSubtract: "Num-",
    NumpadMultiply: "Num*",
    NumpadDivide: "Num/",
    NumpadDecimal: "Num.",
    NumpadEnter: "Enter",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    NumLock: "NumLock",
    ScrollLock: "ScrollLock",
    MediaTrackNext: "MediaTrackNext",
    MediaTrackPrevious: "MediaTrackPrevious",
    MediaStop: "MediaStop",
    MediaPlayPause: "MediaPlayPause",
    Semicolon: ";",
    Equal: "=",
    Comma: ",",
    Minus: "-",
    Period: ".",
    Slash: "/",
    Backquote: "`",
    BracketLeft: "[",
    Backslash: "\\",
    BracketRight: "]",
    Quote: "'",
  } as { [key: string]: string };
  const altKeyName = navigator.userAgent.indexOf("Mac") !== -1 ? "Option" : "Alt";
  const metaKeyName
    = navigator.userAgent.indexOf("Mac") !== -1
      ? "Command"
      : navigator.userAgent.indexOf("Win") !== -1
        ? "Windows"
        : "Meta";

  const specialKeyCodes = new Set([
    "ShiftLeft",
    "ShiftRight",
    "ControlLeft",
    "ControlRight",
    "AltLeft",
    "AltRight",
    "Escape",
    "MetaLeft",
    "MetaRight",
    "ContextMenu",
  ]);

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
}
