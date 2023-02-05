import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControlsBar";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/Hymn-For-The-Weekend.mp3";

interface AppState {
  expanded: boolean;
  audio: HTMLAudioElement;
}

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    expanded: false,
    audio: new Audio(testAudioFile),
  };

  expandSongDetails = () => {
    console.log("Expand song details");
    this.setState({ expanded: !this.state.expanded });
  };
  render() {
    const { audio } = this.state;
    return (
      <div
        className="relative grid overflow-y-hidden h-screen min-h-screen w-full"
        style={{
          gridTemplateColumns: "auto 1fr",
        }}
      >
        <Sidebar />
        <MediaControlsBar expandFunc={this.expandSongDetails} src={audio.src} />
        <MainWindow />
      </div>
    );
  }
}
export default App;
