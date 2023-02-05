import React from "react";
import Topbar from "../Topbar";

function MainWindow() {
  return (
    <div className="h-full">
      <Topbar />
      <div className="relative flex flex-col overflow-hidden h-full w-full bg-gray-300 dark:bg-gray-700">
        <div className="h-16 sticky top-0" />
        <div className="h-full w-full flex flex-col items-start justify-start overflow-y-scroll">
          <p className="w-full text-center text-gray-800 dark:text-white">Hello</p>
        </div>
      </div>
    </div>
  );
}

export default MainWindow;
