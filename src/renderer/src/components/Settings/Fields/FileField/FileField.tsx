import { SettingsFileField } from "@/types";
import { OpenDialogSyncOptions } from "electron";
import Tooltip from "@renderer/components/Tooltip";
import React from "react";

type FileFieldProps = {
  className?: string;
  field: SettingsFileField;
  value: string[] | undefined;
  onChange: (value: any) => void;
};

export default class FileField extends React.Component<FileFieldProps> {
  render() {
    const btnLabel
      = this.buttonLabel
      || (this.value && this.value.length > 0
        ? this.multiSelections
          ? "Choose other Files"
          : "Choose another File"
        : this.multiSelections
          ? "Choose Files"
          : "Choose a File");

    return (
      <div className={`${this.className} field-file key-${this.field.key}`}>
        <div aria-label={this.label} className="font-bold mb-3 text-base text-black dark:text-white">
          {this.label}
        </div>
        <Tooltip className="w-full" content={this.description}>
          <div onClick={this.choose.bind(this)}>
            {this.multiSelections ? "Files" : "File"}:&nbsp;
            {this.value
              ? (
                this.multiSelections || this.value.length > 1
                  ? (
                    <ul>
                      {this.value.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  )
                  : (
                    this.value[0]
                  )
              )
              : (
                "None"
              )}
          </div>
          <button
            className="bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:cursor-not-allowed"
            onClick={this.choose.bind(this)}
          >
            {btnLabel}
          </button>
        </Tooltip>
      </div>
    );
  }

  get className() {
    return this.props.className ?? "";
  }

  get description() {
    return this.field.description ?? "";
  }
  get field() {
    return this.props.field;
  }

  get label() {
    return this.field.label;
  }

  get value() {
    const { value } = this.props;
    if (typeof value === "undefined") {
      return value;
    }
    return Array.isArray(value) ? value : [value];
  }

  get buttonLabel() {
    return this.field.buttonLabel;
  }

  get filters() {
    return this.field.filters;
  }

  get multiSelections() {
    return this.field.multiSelections ?? false;
  }

  get showHiddenFiles() {
    return this.field.showHiddenFiles ?? false;
  }

  get noResolveAliases() {
    return this.field.noResolveAliases ?? false;
  }

  get treatPackageAsDirectory() {
    return this.field.treatPackageAsDirectory ?? false;
  }

  get dontAddToRecent() {
    return this.field.dontAddToRecent ?? false;
  }

  get onChange() {
    return this.props.onChange;
  }

  choose() {
    const { multiSelections, showHiddenFiles, noResolveAliases, treatPackageAsDirectory, dontAddToRecent, filters }
      = this;
    const properties: OpenDialogSyncOptions["properties"] = ["openFile"];

    if (multiSelections) {
      properties.push("multiSelections");
    }
    if (showHiddenFiles) {
      properties.push("showHiddenFiles");
    }
    if (noResolveAliases) {
      properties.push("noResolveAliases");
    }
    if (treatPackageAsDirectory) {
      properties.push("treatPackageAsDirectory");
    }
    if (dontAddToRecent) {
      properties.push("dontAddToRecent");
    }

    const result = window.settings.showOpenDialog({
      properties,
      filters,
    });

    if (!result) {
      return;
    }

    if (result.length > 0) {
      this.onChange(multiSelections ? result : result[0]);
    }
  }
}
