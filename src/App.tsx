import React from 'react';
import MainWindow from './components/MainWindow';
import MediaControlsBar from './components/MediaControls';
import Sidebar from './components/Sidebar';
import testAudioFile from './assets/audio/test.mp3';

class App extends React.Component {

  audio = React.createRef<HTMLAudioElement>();
  testAudio = new Audio(testAudioFile);

  render() {
    this.testAudio.controls=false;
    return (
      <div className="app">
        <Sidebar />
        <MediaControlsBar audio={this.testAudio}/>
        <MainWindow />
      </div>
    );
  }
}
export default App;
