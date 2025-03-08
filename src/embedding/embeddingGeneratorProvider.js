import EmbeddingGeneratorWrapper from "./embeddingGeneratorWrapper.js";
import localEmbeddingGenerator from "./localEmbeddingGenerator.js";

class EmbeddingGeneratorProvider {
  constructor() {
  }

  async getEmbeddingGenerator() {
    const configuredEmbeddingGeneratorKey = process.env.EMBEDDING_GENERATOR;
    let configuredEmbeddingGenerator = new EmbeddingGeneratorWrapper(localEmbeddingGenerator);
    
    if (configuredEmbeddingGeneratorKey === 'local') {
        configuredEmbeddingGenerator= new EmbeddingGeneratorWrapper(localEmbeddingGenerator);
    }
    // Add more embedding generators here
    // if (configuredEmbeddingGenerator === 'remote') {
    //     return new EmbeddingGenerator(remoteEmbeddingGenerator);
    // }
    // if (configuredEmbeddingGenerator === 'cloud') {
    //     return new EmbeddingGenerator(cloudEmbeddingGenerator);
    // }
    await configuredEmbeddingGenerator.init();
    return configuredEmbeddingGenerator;
  }
  
}

const embeddingGeneratorProvider = new EmbeddingGeneratorProvider();
export default embeddingGeneratorProvider;