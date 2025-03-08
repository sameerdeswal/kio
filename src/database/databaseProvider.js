import DatabaseWrapper from "./databaseWrapper.js";
import localdatabase from "./localDatabase.js";

class DatabaseProvider{
    constructor(){

    }

   getDatabaseInstance() {
        const databaseKey = process.env.CONFIG_DATABASE;
        let databaseWrapper = new DatabaseWrapper(localdatabase);
        
        // if (databaseKey === 'local') {
        //     databaseWrapper= new DatabaseWrapper(localdatabase);
        // }
        
        return databaseWrapper;
      }
}

const databaseProvider = new DatabaseProvider();
export default databaseProvider;