import logger from "../../logger.js";
import databaseProvider from "../database/databaseProvider.js";
import embeddingGeneratorProvider from "../embedding/embeddingGeneratorProvider.js";
import dataRepository from "../repositories/dataRepository.js";
import huggingFaceService from "./huggingFaceService.js";

class LLMService {

    async query(kb, text, callback) {
        const embeddignGenerator = await embeddingGeneratorProvider.getEmbeddingGenerator();
        const queryEmbeddings = await embeddignGenerator.generateEmbeddings(text);
        const database = databaseProvider.getDatabaseInstance();
        database.searchVectors(kb, queryEmbeddings, function (similarities) {
            this.dollmCall(text, similarities, callback)
        }.bind(this));
    }

    async dollmCall(text, similarities, callback) {
        let contextText;
        logger.info("similarities " + similarities.length)
        if (similarities.length == 0) {
            // const classificationOutput = huggingFaceService.classifyText(text);
            // const data = dataRepository.getData();
            // const contextKey = data["label-context-map"][classificationOutput];
            // const context = data[contextKey];
            // if (context) {
            //     contextText = context;
            // }
            const classifyAndResponse = await huggingFaceService.classifyAndResponse(text);
            logger.info("classifyAndResponse " + classifyAndResponse)
            callback(classifyAndResponse);
            return;
        } else {
            contextText = similarities.map(similarity => similarity.content).join(' ');
        }

        if (!contextText) {
            callback('I don’t have that information at the moment. Can I help with anything else?');
            return;
        }

        const prompt = `question: ${text} ? context: ${contextText}`;
        const data = {
            question: text,
            context: contextText,
            prompt: prompt
        }
        const outout = await huggingFaceService.query(data);
        callback(outout);
    }
}

const llmService = new LLMService();
export default llmService;