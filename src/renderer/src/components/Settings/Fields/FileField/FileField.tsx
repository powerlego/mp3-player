import { SettingsItem } from "@/types";
import React from "react";

type FileFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function FileField({ field, value, onChange }: FileFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
