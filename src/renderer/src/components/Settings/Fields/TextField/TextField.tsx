import { SettingsItem } from "@/types";
import React from "react";
import Tooltip from "@/renderer/src/components/Tooltip";

type TextFieldProps = {
  className?: string;
  field: SettingsItem;
  value: string;
  onChange: (value: any) => void;
};

export default class TextField extends React.Component<TextFieldProps> {
  render() {
    return (
      <div className={`${this.className} field-text key-${this.field.key} `}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <input
            aria-label={this.label}
            className="w-full rounded-lg text-sm m-[1px] p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
            type="text"
            value={this.value}
            onChange={this.onChange.bind(this)}
          />
        </Tooltip>
      </div>
    );
  }

  get className() {
    return this.props.className || "";
  }

  get description() {
    return this.field.description || "";
  }
  get field() {
    return this.props.field;
  }

  get label() {
    return this.field.label;
  }

  get value() {
    return this.props.value || "";
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    return this.props.onChange(e.target.value);
  }
}
