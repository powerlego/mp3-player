import React from "react";
import useDarkMode from "@renderer/hooks/useDarkMode";
import { FaMoon, FaSun } from "react-icons/fa";

function Topbar() {
  return (
    <div className="sticky top-0 bottom-0 z-10 m-0 h-16 w-full flex flex-row items-center justify-evenly bg-gray-300 shadow-lg dark:bg-gray-700">
      <ThemeIcon />
    </div>
  );
}

function ThemeIcon(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [darkTheme, setDarkTheme] = useDarkMode();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun
          className="cursor-pointer mr-3 ml-4 text-gray-500 hover:text-stone-400 transition duration-300 ease-in-out"
          size="24"
        />
      ) : (
        <FaMoon
          className="cursor-pointer mr-3 ml-4 text-gray-500 hover:text-stone-400 transition duration-300 ease-in-out"
          size="24"
        />
      )}
    </span>
  );
}

export default Topbar;
