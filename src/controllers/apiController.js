import apiService from '../service/apiService.js';

export default {

    checkBotEligibility(req, res) {
        const clientId = req.query.clientId;
        const botId = req.query.botId;
        const host = req.headers.host;
        const eligiblityObj = apiService.checkEligibility(clientId, botId, host)
        return res.json(eligiblityObj);
    }
}