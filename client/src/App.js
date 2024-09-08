import React, { useState } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import './App.css';

// Import AceEditor themes and modes
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-c_cpp';

function App() {
  const [code, setCode] = useState(`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", n * n);
    return 0;
}`);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [executionTimes, setExecutionTimes] = useState([]); // Array to store execution times
  const [avgExecutionTime, setAvgExecutionTime] = useState(''); // Average execution time

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inputCases = input.split('\n'); // Split multiple test cases by newline
      const response = await axios.post('http://localhost:5000/compile', { code, inputCases });

      setOutput(response.data.output.join('\n')); // Display outputs
      setExecutionTimes(response.data.executionTimes); // Set individual execution times
      setAvgExecutionTime(response.data.avgExecutionTime); // Set average execution time
    } catch (error) {
      setOutput(error.response?.data?.error || 'Error compiling code');
      setExecutionTimes([]); // Reset execution times on error
      setAvgExecutionTime(''); // Reset average time on error
    }
  };

  return (
    <div className="App">
      <h1>C Compiler with Multiple Test Cases</h1>
      <div className="container">
        <div className="left-panel">
          <form onSubmit={handleSubmit}>
            <AceEditor
              mode="c_cpp"
              theme="monokai"
              name="code-editor"
              value={code}
              onChange={setCode}
              fontSize={14}
              showGutter={true}
              highlightActiveLine={true}
              style={{ width: '100%', height: '500px' }}
            />
            <button className="submit-button" type="submit">Run Code</button>
          </form>
        </div>

        <div className="right-panel">
          <h2>Test Cases (one per line):</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter test cases, one per line"
            rows="5"
          />

          <div className="output-box">
            <h2>Output:</h2>
            <pre>{output}</pre>
          </div>

          {/* Display Execution Times for Each Test Case */}
          <div className="execution-time-box">
            <h2>Execution Times:</h2>
            {executionTimes.length > 0 && executionTimes.map((time, index) => (
              <p key={index}>Test Case {index + 1}: {time} ms</p>
            ))}
          </div>

          {/* Display Average Execution Time */}
          <div className="average-time-box">
            <h2>Average Execution Time:</h2>
            <p>{avgExecutionTime ? `${avgExecutionTime} ms` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
