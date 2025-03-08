import { pipeline } from "@huggingface/transformers";

class LocalEmbeddingGenerator {

    constructor() {
    }

    async init() {
        this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    async generateEmbeddings(text) {
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        return output.tolist()[0];
    }
}
const localEmbeddingGenerator = new LocalEmbeddingGenerator();
export default localEmbeddingGenerator;