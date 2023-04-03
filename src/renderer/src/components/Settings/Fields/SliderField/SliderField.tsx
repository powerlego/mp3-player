import { SettingsItem } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import React from "react";

type SliderFieldProps = {
  className?: string;
  field: SettingsItem;
  value: number;
  onChange: (value: any) => void;
};

export default class SliderField extends React.Component<SliderFieldProps> {
  render() {
    return (
      <div className={`${this.className} field-slider key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base p-1 text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          <input
            className="slider-field"
            max={this.max}
            min={this.min}
            step={this.step}
            type={"range"}
            value={this.value}
            onChange={this.onChange.bind(this)}
          />
          <label className="w-1/12 p-1 text-base">{this.value}</label>
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

  get min() {
    return this.field.min || 0;
  }

  get max() {
    return this.field.max || 100;
  }

  get step() {
    return this.field.step || 1;
  }

  get value() {
    return this.props.value || this.min;
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    return this.props.onChange(Number.parseInt(e.target.value, 10));
  }
}
