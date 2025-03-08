import logger from "../../logger.js";
import botRepository from "../repositories/botRepository.js";
import clientsRepository from "../repositories/clientsRepository.js";

export default {
    checkEligibility(clientId, botId, host) {
        logger.info("Checking eligibility with clientId:" + clientId + " botId:" + botId + " host:" + host)
        if (!botRepository.getBot(botId)) {
            const clientConfig = clientsRepository.getClient(clientId, botId);
            logger.info(clientId + " " + botId + " allowedHosts:" + clientConfig.allowedHosts)
            if (!clientConfig || clientConfig.allowedHosts.indexOf(host) < 0) {
                return { status: "500", message: "Not eligible to configure bot here" };
            }
            botRepository.addBot(clientConfig);
        }
        return { status: "200", message: "Bot is eligible" };
    }
}