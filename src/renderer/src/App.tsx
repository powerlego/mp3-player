import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
  const [expanded, setExpanded] = React.useState(false);

  const expandSongDetails = () => {
    console.log("Expand song details");
    setExpanded(!expanded);
  };

  return (
    <div className="relative grid overflow-y-hidden h-full min-h-full w-full grid-areas-layout grid-rows-layout grid-cols-layout">
      <Topbar className="grid-in-main-view z-10 m-0 h-16 w-full flex flex-row items-center justify-evenly" />
      <Sidebar className="z-20 m-0 w-56 grid-in-nav-bar bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white" />
      <MediaControlsBar
        expandFunc={expandSongDetails}
        className="grid-in-now-playing z-30 h-[90px] w-full bg-gray-350 dark:bg-gray-750 px-4"
      />
      <MainWindow className="grid-in-main-view flex flex-col overflow-hidden w-full bg-gray-300 dark:bg-gray-700" />
      <div className="bottom-[108px] left-1/2 absolute -translate-x-1/2 z-[100]" />
    </div>
    // {/* </div> */}
  );
}
export default App;
