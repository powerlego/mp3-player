import React from "react";
import MainWindow from "./components/MainWindow";
import MediaControlsBar from "./components/MediaControls";
import Sidebar from "./components/Sidebar";
import testAudioFile from "./assets/audio/test.mp3";

class App extends React.Component {
    audio = new Audio(testAudioFile);

    render() {
        return (
            <div className="app">
                <Sidebar />
                <MediaControlsBar src={this.audio.src} />
                <MainWindow />
            </div>
        );
    }
}
export default App;
