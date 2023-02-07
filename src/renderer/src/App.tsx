import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import testAudioFile from "@/assets/audio/Hymn-For-The-Weekend.mp3";

function App() {
  const [expanded, setExpanded] = React.useState(false);
  const audio = new Audio(testAudioFile);

  const expandSongDetails = () => {
    console.log("Expand song details");
    setExpanded(!expanded);
  };

  return (
    <div
      className="relative grid overflow-y-hidden h-screen min-h-screen w-full"
      style={{
        gridTemplateColumns: "auto 1fr",
      }}
    >
      <Sidebar />
      <MediaControlsBar expandFunc={expandSongDetails} src={audio.src} />
      <MainWindow />
    </div>
    // {/* </div> */}
  );
}
export default App;
