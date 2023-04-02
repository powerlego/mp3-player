import React from "react";
import { SettingsItem } from "@/types";

type RadioFieldProps = {
  className?: string;
  field: SettingsItem;
  value: number;
  onChange: (value: any) => void;
};

export default class RadioField extends React.Component<RadioFieldProps> {
  render() {
    const { field, value } = this.props;

    return (
      <div className={`key-${field.key}`}>
        <div>{field.label}</div>
        <span>{value}</span>
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
