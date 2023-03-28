import { SettingsItem } from "@/types";
import React from "react";

type DropdownFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function DropdownField({ field, value, onChange }: DropdownFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
