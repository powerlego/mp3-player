import React from "react";
import { SettingsItem } from "@/types";

type RadioFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function RadioField({ field, value, onChange }: RadioFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
