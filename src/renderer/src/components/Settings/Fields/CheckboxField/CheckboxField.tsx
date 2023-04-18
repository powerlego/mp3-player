import { CheckboxOption, SettingsCheckboxField } from "@/types";
import Tooltip from "@renderer/components/Tooltip";
import newGuid from "@renderer/utils/newGuid";
import React from "react";

type CheckboxFieldProps = {
  className?: string;
  field: SettingsCheckboxField;
  value: boolean | string | number | (string | number | boolean)[];
  onChange: (value: any) => void;
};

export default class CheckboxField extends React.Component<CheckboxFieldProps> {
  render() {
    let { value } = this;
    const fieldId = `checkbox_${newGuid()}`;
    const options = this.options.map((option, idx) => {
      if (typeof value === "boolean" && this.options.length === 1) {
        value = value ? [option.value] : [];
      }
      else if (typeof value !== "object") {
        value = [];
      }

      const id = `${fieldId}_${idx}`;
      const checked = value.includes(option.value);

      return (
        <label className="block relative pl-9 mb-3 cursor-pointer select-none group" htmlFor={id} key={idx}>
          {option.label}
          <input
            aria-label={option.label}
            checked={checked}
            className="absolute opacity-0 cursor-pointer h-0 w-0 peer"
            id={id}
            type="checkbox"
            onChange={this.onChange.bind(this)}
          />
          <span className="absolute top-0 left-0 w-5 h-5 bg-black dark:bg-white bg-opacity-0 dark:bg-opacity-0 border-gray-650 dark:border-gray-400 border border-solid rounded group-hover:bg-opacity-10 dark:group-hover:bg-opacity-5 peer-checked:bg-blue-500 peer-checked:border-blue-500 dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-2 peer-focus:border-2 peer-focus:border-blue-500 dark:peer-focus:border-blue-500 peer-checked:peer-focus:border-blue-300 dark:peer-checked:peer-focus:border-blue-300 group-hover:peer-checked:bg-blue-600 group-hover:peer-checked:border-blue-600 dark:group-hover:peer-checked:bg-blue-600 dark:group-hover:peer-checked:border-blue-600 after:absolute after:hidden peer-checked:after:block after:left-[5px] after:top-0.5 after:w-[5px] after:h-2.5 after:border-solid after:border-white dark:after:border-gray-900 after:border-t-0 after:border-r-2 after:border-b-2 after:border-l-0 after:scale-100 after:rotate-45 after:animation-delay-50 after:animate-zoom-in-check-square " />
        </label>
      );
    });

    return (
      <div className={`${this.className} field-checkbox key-${this.field.key}`}>
        <div className="font-bold mb-3 text-base text-black dark:text-white">{this.label}</div>
        <Tooltip className="w-full" content={this.description}>
          {options}
        </Tooltip>
      </div>
    );
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
    return this.props.value ?? [];
  }

  get options() {
    return this.field.options ?? [];
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = this;
    const idx = e.target.id.split("_")[2];
    const option = this.options[idx] as CheckboxOption;

    if (typeof value === "boolean" && this.options.length === 1) {
      value = value ? [option.value] : [];
    }
    else if (typeof value !== "object") {
      value = [];
    }

    if (e.target.checked) {
      if (!value.includes(option.value)) {
        value.push(option.value);
      }
    }
    else {
      const valIdx = value.indexOf(option.value);
      if (valIdx > -1) {
        value.splice(valIdx, 1);
      }
    }

    return this.props.onChange(value);
  }
}
