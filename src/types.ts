// Import necessary types from the music-metadata and electron packages.
import { FileFilter } from "electron";
import { IAudioMetadata } from "music-metadata/lib/type";

// Defines an interface for internationalized aria labels for various elements of a media player.
export interface I18nAriaLabels {
  player?: string; // Aria label for the player.
  progressControl?: string; // Aria label for the progress control.
  volumeControl?: string; // Aria label for the volume control.
  // Aria labels for different player controls such as play, pause, previous, next, etc.
  // Each one represents a different player action.
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

// Interface for metadata payload. It contains the status, message, and data (name and cover details) of a song.
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

// Interface for file payload. It includes metadata, Uint8Array data, a picture, and an array of pictures.
export interface FilePayload {
  metadata: IAudioMetadata;
  uint8Array: Uint8Array;
  picture: {
    base64: string;
    format: string;
    dimensions: string;
  };
  pictures: {
    base64: string;
    format: string;
    dimensions: string;
  }[];
}

// Defines an interface for the cover art of a track, including source and format.
export interface CoverArt {
  src?: string;
  format?: string;
}

// Enum for iteration type.
export enum IterationType {
  SINGLE, // Single iteration.
  INFINITE, // Infinite iteration.
}

// Interface for scrolling animation properties.
export interface ScrollingAnimationProps {
  speed: number; // Speed of scrolling.
  pauseAtEndEdgeDurationMs: number; // Pause duration at the end edge in milliseconds.
  initialMouseIntDelayMs: number; // Initial mouse interaction delay in milliseconds.
  iterationType: IterationType; // Type of iteration, can be single or infinite.
}

// Type definition for communication channels.
export type Channels = "minimizeApp" | "maximizeApp" | "closeApp";

// Type for a settings section, which has an id, optional label and icon, and a form consisting of groups.
export type SettingsSection = {
  id: string;
  label?: string;
  icon?: string;
  form: {
    groups: Group[];
  };
};

type Field =
  | SettingsTextField
  | SettingsNumberField
  | SettingsSliderField
  | SettingsRadioField
  | SettingsDropdownField
  | SettingsListField
  | SettingsFileField
  | SettingsDirectoryField
  | SettingsColorField
  | SettingsCheckboxField
  | SettingsAcceleratorField;

// Type for a group within a settings section, which has an id, optional label, and a list of fields.
export type Group = {
  id: string;
  label?: string;
  fields: Field[];
};

// Base type for a settings item, including type, label, key, and an optional description.
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
    | "list"
    | "directory";
  label: string;
  key: string;
  description?: string;
};

// Defines a type for each kind of settings field, where each type extends from the base `SettingsItem` type and adds its own unique properties.
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

export type SettingsAcceleratorField = SettingsItem & {
  modifierRequired?: boolean;
  allowOnlyModifier?: boolean;
};

// Define types for different color models.
export type HexColor = string;
export type RgbColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};
export type HslColor = {
  h: number;
  s: number;
  l: number;
  a?: number;
};

// Define types for options in radio, dropdown and checkbox fields.
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
  value: boolean | string | number;
};

// Define a type for a track, which includes album, artist, id, name, and storageLocation.
export type Track = {
  album: string;
  artist: string;
  id: string;
  name: string;
  storageLocation: string;
};

// Define a type for key bindings for media controls.
export type MediaControlKeyBindings = {
  playPause: string;
  jumpBackward: string;
  jumpForward: string;
  volumeUp: string;
  volumeDown: string;
  mute: string;
  repeat: string;
  shuffle: string;
};

export type Settings = {
  ui: {
    themes: {
      theme: string;
    };
  };
  keyBindings: {
    mediaControls: MediaControlKeyBindings;
  };
};

export enum RepeatMode {
  NONE,
  ALL,
  ONCE,
}

export enum MediaReadyState {
  HAVE_NOTHING,
  HAVE_METADATA,
  HAVE_CURRENT_DATA,
  HAVE_FUTURE_DATA,
  HAVE_ENOUGH_DATA,
}
