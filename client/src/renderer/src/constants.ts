/* eslint-disable @typescript-eslint/naming-convention */
export type TIME_FORMAT = "auto" | "mm:ss" | "hh:mm:ss";

export type AUDIO_PRELOAD_ATTRIBUTE = "auto" | "metadata" | "none";

const columns = {
  default: {
    MINIMUM_COLUMN_WIDTH: 180,
    TWO_COLUMNS_MAX_WIDTH: 500,
    THREE_COLUMNS_MAX_WIDTH: 700,
    FOUR_COLUMNS_MAX_WIDTH: 850,
    MIN_COLUMNS_COUNT: 2,
  },
  compact: {
    MINIMUM_COLUMN_WIDTH: 1.165 * 180,
    TWO_COLUMNS_MAX_WIDTH: 582.5,
    THREE_COLUMNS_MAX_WIDTH: 815.5,
    FOUR_COLUMNS_MAX_WIDTH: 990.25,
    MIN_COLUMNS_COUNT: 2,
  },
  expanded: {
    MINIMUM_COLUMN_WIDTH: 0.835 * 180,
    TWO_COLUMNS_MAX_WIDTH: 417.5,
    THREE_COLUMNS_MAX_WIDTH: 584.5,
    FOUR_COLUMNS_MAX_WIDTH: 709.75,
    MIN_COLUMNS_COUNT: 2,
  },
};

export function getColumns(columnsType: string): {
  MINIMUM_COLUMN_WIDTH: number;
  TWO_COLUMNS_MAX_WIDTH: number;
  THREE_COLUMNS_MAX_WIDTH: number;
  FOUR_COLUMNS_MAX_WIDTH: number;
  MIN_COLUMNS_COUNT: number;
} {
  return columns[columnsType];
}
