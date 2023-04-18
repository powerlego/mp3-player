import { SettingsAcceleratorField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import codeToChar from "@renderer/utils/codeToChar";
import React from "react";

type AcceleratorFieldProps = {
  className?: string;
  field: SettingsAcceleratorField;
  value: string;
  onChange: (value: any) => void;
};

type AcceleratorFieldState = {
  pressing: boolean;
  accelerator: string;
};

export default class AcceleratorField extends React.Component<AcceleratorFieldProps, AcceleratorFieldState> {
  constructor(props: AcceleratorFieldProps) {
    super(props);

    this.state = {
      pressing: false,
      accelerator: "",
    };
  }

  render() {
    return (
      <div className={`${this.className} field-accelerator key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <input
            readOnly
            aria-label={this.label}
            className="w-full rounded-lg text-sm m-0.5 p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
            type="text"
            value={(this.pressing && this.accelerator) || this.value}
            onKeyDown={this.handleKeyDown.bind(this)}
            onKeyUp={this.handleKeyUp.bind(this)}
          />
        </Tooltip>
      </div>
    );
  }

  handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const keys = [
      event.ctrlKey && "Ctrl",
      event.metaKey && this.metaKeyName,
      event.altKey && this.altKeyName,
      event.shiftKey && "Shift",
    ].filter(Boolean) as string[];

    if (!this.specialKeyCodes.has(event.code) && event.code in codeToChar) {
      if (keys.length === 0 && (event.code === "Backspace" || event.code === "Delete")) {
        this.setState({
          pressing: false,
        });
        this.onChange("");
        return;
      }
      if (this.modifierRequired && keys.length === 0) {
        return;
      }
      keys.push(codeToChar[event.code]);
      this.onChange(keys.join("+"));
    }
    else if (this.allowOnlyModifier && this.modifierKeyCodes.has(event.code) && keys.length === 1) {
      this.onChange(keys[0]);
      return;
    }
    this.setState({
      pressing: true,
      accelerator: keys.join("+"),
    });
  }

  handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    this.setState({
      pressing: false,
    });
  }

  get modifierKeyCodes() {
    return new Set([
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
  }

  get specialKeyCodes() {
    return new Set([
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
  }

  get altKeyName() {
    if (navigator.userAgent.indexOf("Mac") !== -1) {
      return "Option";
    }
    return "Alt";
  }

  get metaKeyName() {
    if (navigator.userAgent.indexOf("Mac") !== -1) {
      return "Command";
    }
    else if (navigator.userAgent.indexOf("Win") !== -1) {
      return "Windows";
    }
    return "Meta";
  }

  get className() {
    return this.props.className ?? "";
  }

  get description() {
    return this.field.description ?? "";
  }
  get field() {
    return this.props.field;
  }

  get label() {
    return this.field.label;
  }

  get value() {
    return this.props.value ?? "";
  }

  get modifierRequired() {
    return this.field.modifierRequired ?? false;
  }

  get allowOnlyModifier() {
    return this.field.allowOnlyModifier ?? false;
  }

  get pressing() {
    return this.state.pressing;
  }

  get accelerator() {
    return this.state.accelerator;
  }

  get onChange() {
    return this.props.onChange;
  }
}
