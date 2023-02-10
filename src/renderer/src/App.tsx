import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
  const [expanded, setExpanded] = React.useState(false);
  const [src, setSrc] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    window.api.onFileOpen((_event, file) => {
      const blob = new Blob([file.uint8Array], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setSrc(url);
    });
  });

  const expandSongDetails = () => {
    console.log("Expand song details");
    setExpanded(!expanded);
  };

  const audio = React.useRef<HTMLAudioElement>(null);
  return (
    <>
      <audio controls={false} preload="false" ref={audio} src={src} />
      <div className="relative grid overflow-y-hidden h-full min-h-full w-full grid-areas-layout grid-rows-layout grid-cols-layout">
        <Topbar className="grid-in-main-view z-10 m-0 h-16 w-full flex flex-row items-center justify-evenly" />
        <Sidebar className="z-20 m-0 w-56 grid-in-nav-bar bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white" />
        <MediaControlsBar
          audio={audio}
          expandFunc={expandSongDetails}
          className="grid-in-now-playing z-30 h-[90px] w-full bg-gray-350 dark:bg-gray-750 px-4"
        />
        <MainWindow
          audio={audio}
          className="grid-in-main-view flex flex-col overflow-hidden w-full bg-gray-300 dark:bg-gray-700"
        />
      </div>
    </>
  );
}
export default App;
