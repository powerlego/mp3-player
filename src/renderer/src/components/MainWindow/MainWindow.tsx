import React from "react";

type MainWindowProps = {
  className?: string;
};

function MainWindow({ className }: MainWindowProps) {
  const arr: string[] = [];
  for (let i = 0; i < 100; i++) {
    arr.push(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum asperiores harum minima nemo sunt deserunt, error sint recusandae modi, repellendus impedit officiis eius necessitatibus atque sed esse rem assumenda illum!"
    );
  }

  return (
    <div className={className}>
      <div className="h-16 sticky top-0" />
      <div className="h-full w-full flex flex-col items-start justify-start overflow-y-scroll mx-2">
        {arr.map((item, index) => (
          <p key={index} className="w-full text-gray-800 dark:text-white">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default MainWindow;
