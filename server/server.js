const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const generateFile = require('./generateFile');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let programProcess = null;

app.post('/compile', async (req, res) => {

    const { code, inputCases } = req.body; // Destructure code and inputCases from the request body

    console.log("Incoming Request Body:", req.body); // Add this line to log the incoming request

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    if (!Array.isArray(inputCases) || inputCases.length === 0) {
        return res.status(400).json({ error: 'No input cases provided' });
    }

    try {
        const filePath = await generateFile(code);
        const jobId = path.basename(filePath).split('.')[0];
        const outPath = path.join(__dirname, 'outputs', `${jobId}`);

        exec(`gcc "${filePath}" -o "${outPath}"`, (error, stdout, stderr) => {
            if (error || stderr) {
                const errorMessage = stderr
                    .split('\n')
                    .filter(line => line.includes(':'))
                    .map(line => line.trim())
                    .join('\n');
                return res.status(500).json({ error: errorMessage || 'Compilation failed with an unknown error.' });
            }

            const runCmd = process.platform === 'win32' ? `${outPath}.exe` : `./${outPath}`;

            const results = [];
            const executionTimes = []; // Store execution times for each test case

            inputCases.forEach((input, idx) => {
                const startTime = Date.now(); // Start measuring time for each test case

                programProcess = spawn(runCmd, { cwd: path.join(__dirname, 'outputs') });

                if (input) {
                    programProcess.stdin.write(`${input}\n`);
                }

                programProcess.stdout.on('data', (data) => {
                    results[idx] = data.toString();
                });

                programProcess.stderr.on('data', (data) => {
                    results[idx] = `Error: ${data.toString()}`;
                });

                programProcess.on('close', () => {
                    const endTime = Date.now(); // End measuring time for each test case
                    const executionTime = endTime - startTime; // Calculate execution time
                    executionTimes[idx] = executionTime; // Store execution time
                    programProcess = null;

                    // Check if all test cases have been processed
                    if (results.length === inputCases.length) {
                        const avgExecutionTime = executionTimes.reduce((acc, time) => acc + time, 0) / executionTimes.length;
                        res.json({ output: results, executionTimes, avgExecutionTime });
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error running code:", error);
        res.status(500).json({ error: "Failed to run code" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
