import logger from "../../logger.js";
import dataReader from "../helper/dataReader.js";
import path from 'path';

class ClientsRepository {

    clientMap = {};
    constructor() {

    }

    async init() {
        logger.info("Reading client data");
        const filePath = path.resolve(process.env.CLIENTS_FILE_PATH);
        const clients = await dataReader.readJsonFile(filePath);
        logger.info("Client data read successfully");
        logger.debug("Client Data "+JSON.stringify(clients));
        clients.clients.forEach(client => {
            this.clientMap[client.id + "-" + client.bot_id] = client;
        });
    }

    getClient(clientId, botId) {
        return this.clientMap[clientId + "-" + botId];
    }
}

const clientsRepository = new ClientsRepository();
export default clientsRepository;