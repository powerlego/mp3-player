import { SettingsItem } from "@/types";
import React from "react";

type NumberFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function NumberField({ field, value, onChange }: NumberFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
