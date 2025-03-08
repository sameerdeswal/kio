import { pipeline } from "@huggingface/transformers";
import logger from "../../logger.js";
import dataRepository from '../repositories/dataRepository.js'

class HuggingFaceService {

    constructor() {
        this.questionAnswering = null;
    }



    async init() {
        let progressListener = function (event) {
            logger.info(JSON.stringify(event));
        }
        // this.generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M');
        this.questionAnswering = await pipeline("question-answering", null, {
            progress_callback: progressListener
        });
        this.classification = await pipeline('zero-shot-classification', null, {
            progress_callback: progressListener
        });
    }

    async query(data) {
        logger.info("LLM Query with data :" + JSON.stringify(data));
        const output = await this.questionAnswering(data.question, data.context);
        logger.info("LLM Response " + JSON.stringify(output));
        return output.answer;
    }

    async classifyText(text) {
        const data = dataRepository.getData()
        const labels = data["classification_labels"];
        logger.info("classifyText " + text + " with labels" + JSON.stringify(labels));
        if (labels && labels.length > 0) {
            const output = await this.classification(text, labels);
            logger.info("classifyText " + text + " output " + JSON.stringify(output));
            if (output.scores && output.scores[0] != undefined && output.scores[0] > 0.5) {
                return output.labels[0];
            }
        }
        logger.info("Either classification_labels not added or no label is classified " + JSON.stringify(labels));
        return undefined;
    }

    async classifyAndResponse(text) {
        // Define the candidate labels (the categories that we want to classify into)
        const candidateLabels = ['greeting', 'small_talk', 'farewell', 'general_query'];
        const output = await this.classification(text, candidateLabels);

        // Get the predicted label with the highest score
        let predictedLabel = output.labels[0];
        logger.info(text + " classified as " + predictedLabel + " with score" + output.scores[0])
        if (output.scores[0] < 0.5) {
            predictedLabel = undefined;
        }
        // Based on the predicted label, return an appropriate response
        switch (predictedLabel) {
            case 'greeting':
                return "Hello! How can I assist you today?";
            case 'small_talk':
                return "I'm doing great, thanks for asking! How about you?";
            case 'farewell':
                return "Goodbye! Take care!";
            case 'general_query':
                return "I'm not sure about that, but let me know if you'd like help with something else!";
            default:
                return "I'm not sure I understand. Could you clarify?";
        }
    }
}

const huggingfaceService = new HuggingFaceService();
export default huggingfaceService;