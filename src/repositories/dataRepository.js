import logger from "../../logger.js";
import dataReader from "../helper/dataReader.js";
import path from "path";


class DataRepository{
    
    async init() {
        logger.info("Reading client data");
        const filePath = path.resolve(process.env.DATA_PATH+"data.json");
        this.dataJson = await dataReader.readJsonFile(filePath);
        logger.debug("Data loaded");
        
    }

    getData() {
        return this.dataJson;
    }
}

const dataRepository = new DataRepository();
export default dataRepository;