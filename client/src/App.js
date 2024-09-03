import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/compile', { code });
      setOutput(response.data.output);
      setTimeComplexity(response.data.timeComplexity);
    } catch (error) {
      setOutput(error.response?.data?.error || 'Error compiling code');
      setTimeComplexity('');
    }
  };

  return (
    <div className="App">
      <h1>C Compiler with Time Complexity Analysis</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="code-editor"
          rows="10"
          cols="50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your C code here"
        ></textarea>
        <br />
        <button className="submit-button" type="submit">Run Code</button>
      </form>
      <div className="output-container">
        <div className="output-box">
          <h2>Output:</h2>
          <pre>{output}</pre>
        </div>
        <div className="complexity-box">
          <h2>Time Complexity:</h2>
          <pre>{timeComplexity}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
