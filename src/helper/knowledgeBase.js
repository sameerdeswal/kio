import fs from 'fs';
import dataReader from './dataReader.js';
import path from 'path';
import logger from '../../logger.js';
import embeddingGeneratorProvider from '../embedding/embeddingGeneratorProvider.js'
import databaseProvider from '../database/databaseProvider.js'

class KnowledgeBase {

    constructor() {
        this.knowledgeBase = {};
    }

    async init() {
        const knowledgeBasePath = path.resolve(process.env.KNOWLEDGE_BASE_PATH);
        const files = fs.readdirSync(knowledgeBasePath)
        for (const file of files) {
            const filePath = path.join(knowledgeBasePath, file);
            await this.loadKnowledgeBaseFile(filePath);
        }
    }

    async loadKnowledgeBaseFile(filePath) {
        let fileName = path.basename(filePath);
        fileName = fileName.substring(0, fileName.indexOf("."));
        logger.info("Loading knowledge base of " + fileName);
        const embeddingGenerator = await embeddingGeneratorProvider.getEmbeddingGenerator();
        const database = databaseProvider.getDatabaseInstance();
        const fullContent = await dataReader.readFileContent(filePath)
        const contentChunks = fullContent.match(/[^\.!\?]+[\.!\?]+/g);
        for (const chunk of contentChunks) {
            let output = await embeddingGenerator.generateEmbeddings(chunk);
            database.insert(fileName, chunk, output);
        }
    }
}

const knowledgeBase = new KnowledgeBase();
export default knowledgeBase;