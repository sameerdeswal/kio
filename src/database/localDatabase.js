
import sqlite3 from 'sqlite3';
import logger from '../../logger.js';

class LocalDatabase {

    localdb = null;
    constructor() {
        const SQLite3Verbose = sqlite3.verbose();
        this.localdb = new SQLite3Verbose.Database('vector.db');
        this.localdb.run("DROP TABLE IF EXISTS vectors");
        this.localdb.serialize(() => {
            this.localdb.run("CREATE TABLE IF NOT EXISTS vectors (id INTEGER PRIMARY KEY AUTOINCREMENT,kb VARCHAR, vector BLOB, content TEXT)");
        })
    }

    insert(kb, content, vectors) {
        const stmt = this.localdb.prepare("INSERT INTO vectors (kb,vector,content) VALUES (?, ?, ?)");
        stmt.run(kb, JSON.stringify(vectors), content);
        stmt.finalize();
        logger.debug(`Inserted vector for content: ${content}`);
    }


    searchVectors(kb, queryVector, callback) {
        this.localdb.all("SELECT id, vector,content FROM vectors where kb='" + kb + "'", (err, rows) => {
            if (err) throw err;
            const cosineSimilarity = (vecA, vecB) => {
                const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
                const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
                const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
                return dotProduct / (magA * magB);
            };
            let similarities = rows.map((row) => {
                const storedVector = JSON.parse(row.vector.toString());
                const similarity = cosineSimilarity(queryVector, storedVector);
                return { id: row.id, similarity: (isNaN(similarity) ? 0 : similarity), content: row.content };
            });
            similarities.sort((a, b) => b.similarity - a.similarity);
            similarities = similarities.filter((similarity) => similarity.similarity > 0.5);
            callback(similarities.slice(0, 5)); // Return top 5 similar vectors
        });
    }
}

const localdatabase = new LocalDatabase();
export default localdatabase;