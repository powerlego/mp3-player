import { SettingsItem } from "@/types";
import React from "react";

type CheckboxFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function CheckboxField({ field, value, onChange }: CheckboxFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
