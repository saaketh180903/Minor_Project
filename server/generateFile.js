const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

// Create the 'codes' directory if it doesn't exist
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

// Function to generate a file
const generateFile = async (content) => {
  const jobID = uuid();
  const filename = `${jobID}.c`; 
  const filePath = path.join(dirCodes, filename);

  await fs.promises.writeFile(filePath, content);
  return filePath;
};

module.exports = generateFile; // Export the function
