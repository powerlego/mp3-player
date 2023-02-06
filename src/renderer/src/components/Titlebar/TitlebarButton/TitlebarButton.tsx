import React, { PropsWithChildren } from "react";

type TitlebarButtonProps = PropsWithChildren<{
  message: "minimizeApp" | "maximizeApp" | "closeApp";
}>;

function TitlebarButton({ message, children }: TitlebarButtonProps) {
  return (
    <button
      className="w-4 h-4 flex items-center justify-center"
      onClick={() => {
        window.electron.ipcRenderer.sendMessage(message, [message]);
      }}
    >
      {children}
    </button>
  );
}

export default TitlebarButton;
