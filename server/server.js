const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PythonShell = require('python-shell').PythonShell;
//const { PythonShell } = require('python-shell');
const generateFile = require('./generateFile')
const executeConly = require('./executeC.js');
const { spawn } = require('child_process');

var options = {
    mode: 'text',
    pythonPath: 'parser.py',
    pythonOptions: ['-u'],
    scriptPath: 'path/to/my/scripts',
    args: ['value1', 'value2', 'value3']
  };

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/compile', async(req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

  try {
    // Generate file based on language and code
    let filePath;
    filePath = await generateFile(code);
    let output;
    output = await executeConly(filePath, code);

    const inputText = req.body.code;

    console.log(inputText)

    // Spawn a new Python process
    const pythonProcess = spawn('python', ['parser.py', inputText]);

    let complexityAnalysis = '';

    // Capture data from the Python script's stdout
    pythonProcess.stdout.on('data', (data) => {
        complexityAnalysis += data.toString();
    });

    // Capture any error messages
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    console.log(complexityAnalysis)

    // When the process finishes, send the output back to the frontend
    pythonProcess.on('close', (code) => {
        res.json({ output: output,
            timeComplexity : complexityAnalysis,
         });
    });

    // Delete generated file
    // fs.unlink(filePath, () => {});
    // console.log(output);
    // const spawn = require("child_process").spawn;
    // const pythonProcess = spawn('python',["parser.py", code])
    // pythonProcess.stdout.on('data', (data) => {
    //     // Do something with the data returned from python script
    //     const complexityAnalysis = JSON.parse(data);
    //     res.json({
    //         output:output,
    //         timeComplexity : complexityAnalysis
    //     })
    //    })
    // try {
        
    //     // ... (use complexityAnalysis in your server logic) ...
    // } catch (parseError) {
    //     console.error("Failed to parse Python script output:", parseError);
    //     res.status(500).json({ error: 'Failed to parse analysis results' });
    // }
    // res.json({
    //     output: output,
    // })
  } catch (error) {
    console.error("Error running code:", error);
    res.status(500).json({ error: "Failed to run code" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
