import React, { useState } from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControls";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/test.mp3";




class App extends React.Component {
  audio = new Audio(testAudioFile);
  

  
  render() {
    return (
      <div>
        <audio src={this.audio.src} ref={this.audioRef} />
        <div className="app">
          <Sidebar />
          <MediaControlsBar audio={this.audioRef.current!} togglePlay={this.togglePlay} />
          <MainWindow />
        </div>
      </div>
    );
  }
}
export default App;
