import { SettingsItem } from "@/types";
import React from "react";

type ColorFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function ColorField({ field, value, onChange }: ColorFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
