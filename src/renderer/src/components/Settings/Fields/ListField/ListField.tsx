import { SettingsItem } from "@/types";
import React from "react";

type ListFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function ListField({ field, value, onChange }: ListFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
