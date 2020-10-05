require("dotenv").config();

const Telegraf = require("telegraf");
const LocalSession = require("telegraf-session-local");
const mongoose = require("mongoose");
const cachegoose = require("cachegoose");
const {
  startHandler,
  blankHandler,
  sendTask,
  inlineTableHandler,
  answersHandler,
} = require("./handlers");

const { BOT_NAME, BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME });

bot.use(new LocalSession({ database: "sessions.json" }).middleware());

bot.command("start", startHandler());

bot.action(...blankHandler());
bot.action(...sendTask());
bot.action(...inlineTableHandler());
bot.action(...answersHandler());

bot.startPolling();

cachegoose(mongoose);
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  async (err) => {
    if (err) throw err;
    console.log("[Database] База данных Mongo успешно подключена.");
  }
);
