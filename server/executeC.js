const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');

// Create the 'outputs' directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Function to execute C code
const executeC = (filepath, input) => {
  const jobId = path.basename(filepath).split('.')[0];
  const outPath = path.join(outputPath, `${jobId}.out`); // Use .out file extension
  const inputPath = path.join(outputPath, `${jobId}.txt`); // New input file path

  return new Promise((resolve, reject) => {
    fs.writeFile(inputPath, input, (error) => {
      if (error) {
        reject(error);
      } else {
        exec(
          `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && "./${jobId}.out" < "${inputPath}"`, // Use quotes for paths
          (error, stdout, stderr) => {
            // Clean up the .out and .txt files
            fs.unlink(outPath, () => {});
            fs.unlink(inputPath, () => {});
            if (error) {
              reject({ error, stderr });
            } else if (stderr) {
              reject(stderr);
            } else {
              resolve(stdout);
            }
          }
        );
      }
    });
  });
};

module.exports = executeC; // Use CommonJS export
