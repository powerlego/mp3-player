import { SettingsItem } from "@/types";
import React from "react";

type TextFieldProps = {
  className?: string;
  field: SettingsItem;
  value: string;
  onChange: (key: string, value: any) => void;
};

export default function TextField({ className, field, value, onChange }: TextFieldProps) {
  return (
    <div className={`${className ?? ""} field-text key-${field.key} `}>
      <div className={"font-bold mb-3 text-base"}>{field.label}</div>
      <input
        aria-label={field.label}
        style={{ outline: "none" }}
        type="text"
        value={value}
        className={
          "w-full rounded-lg text-sm m-[1px] p-2 bg-gray-50 dark:bg-gray-650 border border-solid border-gray-350 dark:border-gray-550 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-200 dark:focus:border-blue-300 focus:border-2"
        }
        onChange={(e) => onChange(field.key, e.target.value)}
      />
    </div>
  );
}
