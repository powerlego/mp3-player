import {
  Group,
  SettingsAcceleratorField,
  SettingsCheckboxField,
  SettingsColorField,
  SettingsDirectoryField,
  SettingsDropdownField,
  SettingsFileField,
  SettingsListField,
  SettingsNumberField,
  SettingsRadioField,
  SettingsSliderField,
  SettingsTextField,
} from "@/types";
import React from "react";

import AcceleratorField from "../AcceleratorField";
import CheckboxField from "../CheckboxField";
import ColorField from "../ColorField";
import DirectoryField from "../DirectoryField";
import DropdownField from "../DropdownField";
import FileField from "../FileField";
import ListField from "../ListField";
import NumberField from "../NumberField";
import RadioField from "../RadioField";
import SliderField from "../SliderField";
import TextField from "../TextField";

const fieldMap = {
  accelerator: AcceleratorField,
  checkbox: CheckboxField,
  color: ColorField,
  directory: DirectoryField,
  dropdown: DropdownField,
  file: FileField,
  list: ListField,
  number: NumberField,
  radio: RadioField,
  slider: SliderField,
  text: TextField,
};

type SettingsGroupProps = {
  preferences: { [key: string]: any };
  group: Group;
  label?: string;
  onFieldChange: (key: string, value: any) => void;
};

export default class SettingsGroup extends React.Component<SettingsGroupProps> {
  render() {
    const fields = this.fields
      .map(
        (
          field:
            | SettingsAcceleratorField
            | SettingsCheckboxField
            | SettingsColorField
            | SettingsDirectoryField
            | SettingsDropdownField
            | SettingsFileField
            | SettingsListField
            | SettingsNumberField
            | SettingsRadioField
            | SettingsSliderField
            | SettingsTextField,
          idx: number
        ) => {
          const Field = fieldMap[field.type] as React.ComponentType<any>;
          if (!Field) {
            console.error(`Unknown field type: ${field.type}`);
            return;
          }
          return (
            <Field
              className={"mb-5 pl-2 last:mb-0"}
              field={field}
              key={idx}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              value={this.preferences[this.group.id][field.key]}
              onChange={this.onFieldChange.bind(this, field.key)}
            />
          );
        }
      )
      .filter((field) => field);
    return (
      <div className={`group-${this.group.id ?? ""}`}>
        {this.label ? <div className="text-xl mb-3 font-bold text-black dark:text-white">{this.label}</div> : <></>}
        {fields}
      </div>
    );
  }

  get group() {
    return this.props.group;
  }

  get fields() {
    return this.group.fields;
  }

  get label() {
    return this.props.label;
  }

  get preferences() {
    return this.props.preferences;
  }

  get onFieldChange() {
    return this.props.onFieldChange;
  }
}
