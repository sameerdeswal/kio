import { Server } from "socket.io";
import logger from "../../logger.js";
import botRepository from '../repositories/botRepository.js';
import socketRepository from '../repositories/socketRepository.js';
import llmService from '../service/llmService.js';
import apiService from "../service/apiService.js";

class SocketController {
    constructor() {

    }

    init(server) {
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            }
        });

        this.io.on("connection", (socket) => {
            logger.info("Bot connection request from " + socket.request.headers.host);
            this.handler(socket);
        });

        logger.info("Socket server started");
    }

    handler(socket) {
        socket.on('auth', (data, callback) => {
            try {
                logger.info(data.key + ' Bot auth request received: ' + JSON.stringify(data));

                const eligibilityObj = apiService.checkEligibility(data.clientId, data.botId, socket.request.headers.host)
                if (eligibilityObj.status !== '200') {
                    throw Error("Bot is not eligible");
                }
                const botConfig = botRepository.getBot(data.botId);
                socket.botId = data.botId;
                socket.knowledgebase = data.kb || botConfig.knowledgebase;
                logger.info(data.botId + ' Bot authorized');
                socketRepository.addSocket(socket);
                callback({ status: 'success' });

                if (data.reconnect) {
                    return;
                }
                if (data.kb) {
                    socket.emit('systemMessage', { botMessage: "Hi there! How can I assist you today?" });
                    return;
                }
                let options;
                if (botConfig.welcome_options && botConfig.welcome_options.length > 0 && botConfig.options) {
                    options = botConfig.options.filter(option => {
                        return botConfig.welcome_options.indexOf(option.key) >= 0;
                    })
                }

                socket.emit('systemMessage', { botMessage: botConfig.welcome_message, options: options });
            } catch (e) {
                callback({ status: 'failed' });
                logger.error(e);
            }
        });

        socket.on('room', (message) => {
            logger.info(socket.botId + ' user message ' + JSON.stringify(message));
            if (message.userMessage.length > 100) {
                socket.emit('systemMessage', { botMessage: "I'm unable to handle complex queries right now. Please ask simple questions." });
                return;
            }
            try {
                llmService.query(socket.knowledgebase, message.userMessage, (response) => {
                    logger.info(socket.botId + ' llm response +' + JSON.stringify(response));
                    socket.emit('systemMessage', { botMessage: response });
                });
            } catch (e) {
                socket.emit('systemMessage', { botMessage: "An error has occurred. Please ask again." });
                logger.error("Error whule calling llmService " + e.message, e);
            }
        });

        socket.on('reconnect', (data) => {
            logger.info(socket.botId + ' Bot reconnect request ' + JSON.stringify(data));
        });

        socket.on("disconnect", () => {
            logger.info("Client disconnected");
        });

        return socket;
    }
}

const socketController = new SocketController();
export default socketController;
