import React, { useState } from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControls";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/test.mp3";

class App extends React.Component {
  audio = new Audio(testAudioFile);
  audioRef = React.createRef<HTMLAudioElement>();

  togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    const audio = this.audioRef.current;
    if (!audio) return;
    if ((audio.paused || audio.ended) && audio.src) {
      this.playAudioPromise();
    } else if (!audio.paused) {
      audio.pause();
    }
  };

  playAudioPromise = (): void => {
    const audio = this.audioRef.current;
    if (!audio) return;
    const playPromise = audio.play();
    // playPromise is null in IE 11

    playPromise.then(null).catch((err) => {
      console.log(err);
    });
  };

  componentDidMount() {
    this.forceUpdate();
  }
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
