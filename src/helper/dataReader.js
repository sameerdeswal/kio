import fs from 'fs/promises';

class DataReader {
    constructor() {
    }

    async readFileContent(filePath) {
        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    }

    async readJsonFile(filePath) {
        const data = await this.readFileContent(filePath);
        return JSON.parse(data);
    }
}

const dataReader = new DataReader();
export default dataReader;
