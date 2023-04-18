import React, { PropsWithChildren } from "react";

type SettingsButtonProps = PropsWithChildren<{
  enabled?: boolean;
  onClick?: () => void;
}>;

export default function SettingsButton({ enabled = true, onClick, children }: SettingsButtonProps): JSX.Element {
  return (
    <button
      className="w-[6.5rem] bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-850 enabled:active:bg-gray-150 dark:enabled:active:bg-gray-650 disabled:cursor-not-allowed"
      disabled={!enabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
