import { IAudioMetadata } from "music-metadata/lib/type";

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
  fields: SettingsItem[];
};

export type SettingsItem = {
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
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  options?: RadioOption[] | DropdownOption[];
};

export type RadioOption = {
  label: string;
  value: string | number | boolean;
};

export type DropdownOption = {
  label: string;
  value: string | number | boolean;
};
