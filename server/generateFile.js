const fs = require('fs');
const path = require('path');

const generateFile = async (code) => {
    const fileId = `${Date.now()}`;
    const filePath = path.join(__dirname, 'outputs', `${fileId}.c`);

    await fs.promises.writeFile(filePath, code);
    console.log(`Generated file path: ${filePath}`);

    return filePath;
};

module.exports = generateFile;
