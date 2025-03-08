import dotenv from "dotenv";
import express from "express";
import http from "http";
import routes from "./src/routes.js";
import socketController from "./src/controllers/socketController.js";
import huggingfaceService from "./src/service/huggingfaceService.js";
import clientsRepository from "./src/repositories/clientsRepository.js";
import logger from "./logger.js";
import knowledgeBase from "./src/helper/knowledgeBase.js";
import cors from "cors";
import dataRepository from "./src/repositories/dataRepository.js";

dotenv.config();

logger.info("Initializing Clients Repository");
await clientsRepository.init();
await dataRepository.init();
logger.info("Initializing Hugging Face Service");
await huggingfaceService.init();
logger.info("Populating knowledgebase");
await knowledgeBase.init();
logger.info("Initialization complete");


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;
socketController.init(server)
const corsOptions = {
  origin: "*",
  methods: "GET",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use("/api", routes);
app.use(express.static("public"));

server.listen(port, () => {
  logger.info(`Bot backend started on http://localhost:${port}`);
});