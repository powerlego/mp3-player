import { SettingsItem } from "@/types";
import React from "react";

type ButtonFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function ButtonField({ field, value, onChange }: ButtonFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
