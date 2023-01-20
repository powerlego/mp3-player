import React from "react";
import useDarkMode from "../../hooks/useDarkMode";
import { FaMoon, FaSun } from "react-icons/fa";

function Topbar() {
  return (
    <div className="top-navigation">
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
      {darkTheme
        ? (
          <FaSun className="top-navigation-icon" size="24" />
        )
        : (
          <FaMoon className="top-navigation-icon" size="24" />
        )}
    </span>
  );
}

export default Topbar;
