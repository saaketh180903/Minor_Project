const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Function to execute C code with user input
const executeC = (filepath, input) => {
    const jobId = path.basename(filepath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    const inputPath = path.join(outputPath, `${jobId}.txt`);

    return new Promise((resolve, reject) => {
        fs.writeFile(inputPath, input, (error) => {
            if (error) {
                reject(error);
            } else {
                exec(
                    `gcc "${filepath}" -o "${outPath}" && cd "${outputPath}" && "./${jobId}.out" < "${inputPath}"`,
                    (error, stdout, stderr) => {
                        fs.unlink(outPath, () => {});
                        fs.unlink(inputPath, () => {});

                        if (error || stderr) {
                            reject({ error: error ? error.message : stderr });
                        } else {
                            resolve(stdout);
                        }
                    }
                );
            }
        });
    });
};

module.exports = executeC;
