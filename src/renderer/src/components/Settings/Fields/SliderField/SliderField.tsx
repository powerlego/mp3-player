import { SettingsItem } from "@/types";
import React from "react";

type SliderFieldProps = {
  field: SettingsItem;
  value: number;
  onChange: (value: number) => void;
};

export default function SliderField({ field, value, onChange }: SliderFieldProps) {
  return (
    <div className={`key-${field.key}`}>
      <div>{field.label}</div>
      <span>{value}</span>
    </div>
  );
}
