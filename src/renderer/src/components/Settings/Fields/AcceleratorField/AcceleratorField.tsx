import { SettingsItem } from "@/types";
import React from "react";

type AcceleratorFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function AcceleratorField({ field, value, onChange }: AcceleratorFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
