import React from "react";

type MainWindowProps = {
  className?: string;
};

function MainWindow({ className }: MainWindowProps) {
  return (
    <div className={className}>
      <div className="h-16 sticky top-0" />
      <div className="h-full w-full flex flex-col items-start justify-start overflow-y-scroll">
        <p className="w-full text-center text-gray-800 dark:text-white">Hello</p>
        
      </div>
    </div>
  );
}

export default MainWindow;
