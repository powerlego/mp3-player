import React, { useState } from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControls";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/test.mp3";

class App extends React.Component {  
  testAudio = new Audio(testAudioFile);
  testAudioRef = React.createRef<HTMLAudioElement>();

  togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
  };

  componentDidMount() {
    this.forceUpdate();
  }
  render() {
    return (
      <div>
        <audio src={this.testAudio.src} ref={this.testAudioRef} />
        <div className="app">
          <Sidebar />
          <MediaControlsBar audio={this.testAudioRef.current!} />
          <MainWindow />
        </div>
      </div>
    );
  }
}
export default App;
