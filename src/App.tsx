import React from 'react';
import MainWindow from './components/MainWindow';
import MediaControlsBar from './components/MediaControls';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <div className="app">
      <Sidebar />
      <MediaControlsBar />
      <MainWindow />
    </div>
  );
}

export default App;
