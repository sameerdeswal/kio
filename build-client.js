import fs from 'fs';
import path from 'path';
import javascriptObfuscator from 'javascript-obfuscator';
import logger from "./logger.js";

const inputDir = './client';  // Path to your folder containing JS files
const outputDir = './public';  // Path where you want the minified and obfuscated files

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

if (!fs.existsSync(outputDir + "/css")) {
    fs.mkdirSync(outputDir + "/css");
}

if (!fs.existsSync(outputDir + "/js")) {
    fs.mkdirSync(outputDir + "/js");
}

// Get all .js files from the input directory
fs.readdirSync(inputDir).forEach(file => {
    if (path.extname(file) === '.js') {
        const filePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, "js", file.replace('.js', '.min.js'));

        // Read the content of the file
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        let obfuscatedCode = fileContent;
        // if (process.env.environment === "production") {
        // Obfuscate the JavaScript code
        obfuscatedCode = javascriptObfuscator.obfuscate(fileContent, {
            compact: true,          // Minify the code
            controlFlowFlattening: true,  // Flatten control flow for obfuscation
        }).getObfuscatedCode();
        logger.info(`Obfuscated: ${file}`);
        // } else {
        //     logger.info(`Copied: ${file}`);
        // }

        // Write the obfuscated code to a new file
        fs.writeFileSync(outputFilePath, obfuscatedCode);

    } else if (path.extname(file) === '.css') {
        const filePath = path.join(inputDir, file);
        const outputFilePath = path.join(outputDir, "css", file);

        // Read the content of the CSS file
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Write the CSS file to the output directory
        fs.writeFileSync(outputFilePath, fileContent);

        logger.info(`Copied: ${file}`);
    }
});