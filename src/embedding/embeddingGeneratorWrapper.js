class EmbeddingGeneratorWrapper {

    /**
     * 
     * @param {} internalEmbeddingGenerator 
     */
    constructor(internalEmbeddingGenerator) {
        this.internalEmbeddingGenerator = internalEmbeddingGenerator
    }

    async init() {
        await this.internalEmbeddingGenerator.init();
    }


    async generateEmbeddings(text) {
        return this.internalEmbeddingGenerator.generateEmbeddings(text);
    }
}

export default EmbeddingGeneratorWrapper;