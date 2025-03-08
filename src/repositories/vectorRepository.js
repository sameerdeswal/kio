class VectorRepository {
    constructor() {
        this.vectors = [];
    }

    // Store a vector embedding with an associated id
    storeVector(id, vector,content) {
        this.vectors.push({ id, vector, content });
    }

    // Calculate the Euclidean distance between two vectors
    calculateDistance(vector1, vector2) {
        return Math.sqrt(vector1.reduce((sum, val, index) => sum + Math.pow(val - vector2[index], 2), 0));
    }

    // Search for the closest vector embedding to the given vector
    searchVector(queryVector) {
        let closest = null;
        let closestDistance = Infinity;

        this.vectors.forEach(({ id, vector, content }) => {
            const distance = this.calculateDistance(queryVector, vector);
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = { id, vector, distance, content };
            }
        });

        return closest;
    }
}

const vectorRepository = new VectorRepository();
export default vectorRepository;