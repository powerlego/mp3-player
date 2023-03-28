import { SettingsItem } from "@/types";
import React from "react";

type TextFieldProps = {
  field: SettingsItem;
  value: string;
  onChange: (value: string) => void;
};

export default function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <input aria-label={field.label} type="text" value={value} onChange={(e) => onChange(e.target.value)} />;
    </div>
  );
}
