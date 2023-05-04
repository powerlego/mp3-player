import codeToChar from "@utils/codeToChar";
import React from "react";

const altKeyName = navigator.userAgent.indexOf("Mac") !== -1 ? "Option" : "Alt";
const metaKeyName
  = navigator.userAgent.indexOf("Mac") !== -1
    ? "Command"
    : navigator.userAgent.indexOf("Win") !== -1
      ? "Windows"
      : "Meta";

const modifierKeyCodes = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "ContextMenu",
]);

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

function combineKeyCodes(event: React.KeyboardEvent | KeyboardEvent) {
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

export default combineKeyCodes;
