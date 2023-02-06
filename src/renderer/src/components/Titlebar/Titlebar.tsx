import React from "react";
import TitlebarButton from "./TitlebarButton";
import { ChromeCloseIcon, ChromeRestoreIcon, ChromeMinimizeIcon } from "@fluentui/react-icons-mdl2";

function Titlebar() {
  return (
    <>
      <span className="ml-2 text-white">Title</span>
      <div className="flex items-center justify-end w-20 mr-5 overflow-hidden">
        <div className="flex justify-between gap-2">
          <TitlebarButton message="minimizeApp">
            <ChromeMinimizeIcon />
          </TitlebarButton>
          <TitlebarButton message="maximizeApp">
            <ChromeRestoreIcon />
          </TitlebarButton>
          <TitlebarButton message="closeApp">
            <ChromeCloseIcon />
          </TitlebarButton>
        </div>
      </div>
    </>
  );
}

export default Titlebar;
