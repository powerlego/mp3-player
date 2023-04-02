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
        <div className={"font-bold mb-3 text-base p-1"}>{this.label}</div>
        <Tooltip className={"w-full"} content={this.description}>
          <input
            aria-label={this.label}
            style={{ outline: "none" }}
            type="text"
            value={this.value}
            className={
              "w-full rounded-lg text-sm m-[1px] p-2 bg-gray-100 dark:bg-gray-650 border border-solid border-gray-350 dark:border-gray-550 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-200 dark:focus:border-blue-300 focus:border-2"
            }
            onChange={(e) => this.onChange(e.target.value)}
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

  get onChange() {
    return this.props.onChange.bind(this);
  }
}
