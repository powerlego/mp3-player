import React from "react";
import { SettingsItem } from "@/types";
import newGuid from "@utils/newGuid";
import Tooltip from "@renderer/components/Tooltip/Tooltip";

type RadioFieldProps = {
  className?: string;
  field: SettingsItem;
  value: number;
  onChange: (value: any) => void;
};

export default class RadioField extends React.Component<RadioFieldProps> {
  render() {
    const fieldId = `radio_${newGuid()}`;

    const options = this.options.map((option, idx) => {
      const id = `${fieldId}_${idx}`;

      return (
        <label
          className={"block relative pl-8 mb-3 cursor-pointer select-none transition-all duration-300 ease-out group"}
          htmlFor={id}
          key={idx}
        >
          {option.label}
          <input
            aria-label={option.label}
            checked={this.value === option.value}
            className="absolute opacity-0 cursor-pointer peer"
            id={id}
            name={fieldId}
            type={"radio"}
            onChange={this.onChange.bind(this)}
          />
          <span
            className="absolute top-0 left-0 w-5 h-5 bg-black dark:bg-white bg-opacity-0 dark:bg-opacity-0
          border-gray-650 dark:border-gray-400 border border-solid rounded-full transition-all duration-300 ease-out group-hover:bg-opacity-5 dark:group-hover:bg-opacity-10 peer-checked:bg-blue-500 peer-checked:border-blue-500 dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500 peer-focus:bg-blue-400 peer-focus:border-blue-400 dark:peer-focus:bg-blue-400 dark:peer-focus:border-blue-400 group-hover:peer-checked:bg-blue-600 group-hover:peer-checked:border-blue-600 dark:group-hover:peer-checked:bg-blue-600 dark:group-hover:peer-checked:border-blue-600 after:absolute after:hidden after:scale-100 after:animation-delay-50 after:animate-zoom-in-check-circle after:top-[3px] after:left-[3px] after:w-3 after:h-3 after:rounded-full after:bg-transparent after:border-2 after:border-solid after:border-white dark:after:border-gray-900 peer-checked:after:block"
          />
        </label>
      );
    });
    return (
      <div className={`${this.className} field-radio key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          {options}
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

  get options() {
    return this.field.options || [];
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const idx = e.target.id.split("_")[2];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const option = this.options[idx];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.props.onChange(option.value);
  }
}
