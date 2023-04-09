import { SettingsColorField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import React from "react";

type ColorFieldProps = {
  className?: string;
  field: SettingsColorField;
  value: number;
  onChange: (value: any) => void;
};

export default class ColorField extends React.Component<ColorFieldProps> {
  render() {
    return (
      <div className={`${this.className} field-color key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <span>{this.value}</span>
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
