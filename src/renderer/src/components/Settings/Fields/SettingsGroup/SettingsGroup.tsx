import { Group } from "@/types";
import React from "react";

import AcceleratorField from "../AcceleratorField";
import ButtonField from "../ButtonField";
import CheckboxField from "../CheckboxField";
import ColorField from "../ColorField";
import DropdownField from "../DropdownField";
import FileField from "../FileField";
import ListField from "../ListField";
import NumberField from "../NumberField";
import RadioField from "../RadioField";
import SliderField from "../SliderField";
import TextField from "../TextField";

const FieldMap = {
  accelerator: AcceleratorField,
  button: ButtonField,
  checkbox: CheckboxField,
  color: ColorField,
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

export default function SettingsGroup({ preferences, group, label, onFieldChange }: SettingsGroupProps) {
  const fields = group.fields.map((field, idx) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const Field = FieldMap[field.type];
    if (!Field) {
      console.error(`Unknown field type: ${field.type}`);
      return;
    }
    return (
      <Field
        className={"mb-5 last:mb-0"}
        field={field}
        key={idx}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value={preferences[field.key]}
        onChange={onFieldChange}
      />
    );
  });
  return (
    <div className={`group-${group.id ?? ""}`}>
      {label ? <div className="text-xl mb-3 font-bold">{label}</div> : <></>}
      {fields}
    </div>
  );
}
