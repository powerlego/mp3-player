import React, { PropsWithChildren } from "react";

type SettingsButtonProps = PropsWithChildren<{
  onClick?: () => void;
}>;

export default function SettingsButton({ onClick, children }: SettingsButtonProps): JSX.Element {
  return (
    <button
      className="w-[6.5rem] bg-gray-150 dark:bg-gray-650 px-2 rounded-md py-1 hover:bg-gray-250 dark:hover:bg-gray-550 transition ease-in-out"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
