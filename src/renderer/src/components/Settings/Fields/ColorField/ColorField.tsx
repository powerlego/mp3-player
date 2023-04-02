import { SettingsItem } from "@/types";
import React from "react";

type ColorFieldProps = {
  className?: string;
  field: SettingsItem;
  value: number;
  onChange: (value: any) => void;
};

export default class ColorField extends React.Component<ColorFieldProps> {
  render() {
    return (
      <div className={`key-${this.field.key}`}>
        <div>{this.label}</div>
        <span>{this.value}</span>
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
    return this.props.onChange;
  }
}
