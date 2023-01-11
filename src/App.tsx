import React from 'react';
import MainWindow from './components/MainWindow';
import MediaControls from './components/MediaControls';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <div className="app">
      <Sidebar />
      <MediaControls />
      <MainWindow />
    </div>
  );
}

export default App;
