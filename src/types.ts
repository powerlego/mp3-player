import { IAudioMetadata } from "music-metadata/lib/type";
import { FileFilter } from "electron";

export interface I18nAriaLabels {
  player?: string;
  progressControl?: string;
  volumeControl?: string;
  play?: string;
  pause?: string;
  previous?: string;
  rewind?: string;
  shuffle?: string;
  shuffleOn?: string;
  next?: string;
  loop?: string;
  loopOnce?: string;
  loopOff?: string;
  volume?: string;
  volumeMute?: string;
}

export interface MetaDataPayload {
  status: boolean;
  message: string;
  data: {
    name: string;
    cover: {
      src?: string;
      format?: string;
    };
  };
}

export interface FilePayload {
  metadata: IAudioMetadata;
  uint8Array: Uint8Array;
  picture: {
    base64: string;
    format: string;
  };
}

export interface CoverArt {
  src?: string;
  format?: string;
}

export enum IterationType {
  single = "single",
  infinite = "infinite",
}

export interface ScrollingAnimationProps {
  speed: number;
  pauseAtEndEdgeDurationMs: number;
  initialMouseIntDelayMs: number;
  iterationType: IterationType;
}

export type Channels = "minimizeApp" | "maximizeApp" | "closeApp";

export type SettingsSection = {
  id: string;
  label?: string;
  icon?: string;
  form: {
    groups: Group[];
  };
};

export type Group = {
  id?: string;
  label?: string;
  fields:
    | SettingsTextField[]
    | SettingsNumberField[]
    | SettingsSliderField[]
    | SettingsRadioField[]
    | SettingsDropdownField[]
    | SettingsListField[]
    | SettingsFileField[]
    | SettingsDirectoryField[]
    | SettingsColorField[]
    | SettingsCheckboxField[]
    | SettingsButtonField[]
    | SettingsAcceleratorField[];
};

type SettingsItem = {
  type:
    | "text"
    | "number"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "slider"
    | "file"
    | "accelerator"
    | "color"
    | "button"
    | "list"
    | "directory";
  label: string;
  key: string;
  description?: string;
};

export type SettingsTextField = SettingsItem;

export type SettingsNumberField = SettingsItem & {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
};

export type SettingsSliderField = SettingsItem & {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
};

export type SettingsRadioField = SettingsItem & {
  options: RadioOption[];
};

export type SettingsDropdownField = SettingsItem & {
  options: DropdownOption[];
};

export type SettingsListField = SettingsItem & {
  orderable?: boolean;
  size?: number;
  addItemValidator?: string;
  addItemLabel?: string;
  modalCloseTimeoutMS?: number;
  min?: number;
  max?: number;
};

export type SettingsFileField = SettingsItem & {
  buttonLabel?: string;
  filters?: FileFilter[];
  multiSelections?: boolean;
  showHiddenFiles?: boolean;
  noResolveAliases?: boolean;
  treatPackageAsDirectory?: boolean;
  dontAddToRecent?: boolean;
};

export type SettingsDirectoryField = SettingsItem & {
  buttonLabel?: string;
  multiSelections?: boolean;
  showHiddenFiles?: boolean;
  noResolveAliases?: boolean;
  treatPackageAsDirectory?: boolean;
  dontAddToRecent?: boolean;
};

export type SettingsColorField = SettingsItem & {
  format?: "hex" | "rgb" | "hsl";
};

export type SettingsCheckboxField = SettingsItem & {
  options?: CheckboxOption[];
};

export type SettingsButtonField = SettingsItem & {
  buttonLabel?: string;
  hideLabel?: boolean;
};

export type SettingsAcceleratorField = SettingsItem & {
  modifierRequired?: boolean;
};

export type RadioOption = {
  label: string;
  value: string | number | boolean;
};

export type DropdownOption = {
  label: string;
  value: string | number;
};

export type CheckboxOption = {
  label: string;
  value: boolean;
};
