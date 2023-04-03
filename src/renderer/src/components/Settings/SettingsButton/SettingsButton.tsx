import React, { PropsWithChildren } from "react";

type SettingsButtonProps = PropsWithChildren<{
  onClick?: () => void;
}>;

export default function SettingsButton({ onClick, children }: SettingsButtonProps): JSX.Element {
  return (
    <button
      className="w-[6.5rem] bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition ease-in-out"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
