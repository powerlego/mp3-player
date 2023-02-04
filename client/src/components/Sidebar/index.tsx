import React from "react";

class Sidebar extends React.Component {
  render() {
    return (
      <div className="z-20 m-0 w-56 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white">
        <div className="sticky top-0 bottom-0 flex flex-col">
          <i>A</i>
          <i>B</i>
        </div>
      </div>
    );
  }
}

export default Sidebar;
