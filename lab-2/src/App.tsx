import React from 'react';
import './App.css';
import Canvas from "./components/Canvas/Canvas";
import Header from "./components/Header/Header"

function App() {
  return (
    <div className="App">
        <Header />
        <Canvas />
    </div>
  );
}

export default App;
