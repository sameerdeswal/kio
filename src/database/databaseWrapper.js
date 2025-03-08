class DatabaseWrapper {
    constructor(database) {
        this.internalDatabase = database;
    }

    insert(kb, content, vectors) {
        this.internalDatabase.insert(kb, content, vectors);
    }


    searchVectors(kb, queryVector, callback) {
        this.internalDatabase.searchVectors(kb, queryVector, callback);
    }
}

export default DatabaseWrapper