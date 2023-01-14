import React, { useState } from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControls";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/test.mp3";

function App() {
  const testAudio = new Audio(testAudioFile);
  const [playing, setPlaying] = useState(false);
  const handlePlaying = () => {
    if (playing) {
      testAudio.pause();
    } else {
      testAudio.play();
    }
    setPlaying(!playing);
    console.log(!playing);
  };
  testAudio.controls = false;
  return (
    <div className="app">
      <Sidebar />
      <MediaControlsBar audio={testAudio} onPlay={handlePlaying} />
      <MainWindow />
    </div>
  );
}
export default App;
