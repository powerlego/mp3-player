import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { FilePayload } from "@/types";

function App() {
  const [expanded, setExpanded] = React.useState(false);
  const [src, setSrc] = React.useState("");
  const audio = React.useRef<HTMLAudioElement>(null);
  const requestedPlay = React.useRef(false);

  const handleFileOpen = (_event: Electron.IpcRendererEvent, file: FilePayload, play: boolean): void => {
    const blob = new Blob([file.uint8Array], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    setSrc(url);
    requestedPlay.current = play;
  };

  React.useEffect(() => {
    window.api.onFileOpen(handleFileOpen);
    return () => {
      window.api.offFileOpen(handleFileOpen);
    };
  });

  React.useEffect(() => {
    const playAudioPromise = (): void => {
      if (src === "") {
        console.log("No src");
        return;
      }
      const aud = audio.current;
      if (!aud) {
        return;
      }
      const playPromise = aud.play();
      // playPromise is null in IE 11
      playPromise.then(null).catch((err) => {
        console.log(err);
      });
    };
    if (audio.current && requestedPlay.current) {
      playAudioPromise();
      requestedPlay.current = false;
    }
  }, [audio, src, requestedPlay]);

  const expandSongDetails = () => {
    console.log("Expand song details");
    setExpanded(!expanded);
  };

  return (
    <>
      <audio controls={false} preload="false" ref={audio} src={src} />
      <div className="relative grid overflow-y-hidden h-full min-h-full w-full grid-areas-layout grid-rows-layout grid-cols-layout">
        <Topbar className="grid-in-main-view z-10 m-0 h-16 w-full flex flex-row items-center justify-evenly" />
        <Sidebar className="z-20 m-0 w-56 grid-in-nav-bar bg-gray-150 text-gray-800 dark:bg-gray-900 dark:text-white" />
        <MediaControlsBar
          audio={audio}
          className="grid-in-now-playing z-30 h-[90px] w-full bg-gray-220 dark:bg-gray-880 px-4"
          expandFunc={expandSongDetails}
        />
        <MainWindow
          audio={audio}
          className="grid-in-main-view flex flex-col overflow-hidden w-full bg-gray-180 dark:bg-gray-860"
        />
      </div>
    </>
  );
}
export default App;
