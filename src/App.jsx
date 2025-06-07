import React from 'react';
import FlowchartEditor from './component/FlowchartEditor'; // Assuming you put the above code in FlowchartEditor.js
import './App.css'; // For basic styling

function App() {
  return (
    <div className="App">
      <h1>Voice-to-Flowchart with Gemini AI</h1>
      <FlowchartEditor />
    </div>
  );
}

export default App;