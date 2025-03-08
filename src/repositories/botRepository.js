class BotRepository {
  constructor() {
    this.bots = {};
  }

  addBot(bot) {
    this.bots[bot.bot_id] = bot;
  }

  getBot(id) {
    return this.bots[id];
  }

  removeBot(id) {
    delete this.bots[id];
  }

  getAllBots() {
    return this.bots;
  }
}

const botRepository = new BotRepository();
export default botRepository;
