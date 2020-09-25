require("dotenv").config();

const Telegraf = require("telegraf");
const {
  startHandler,
  blankHandler,
  createTestTable,
  inlineTableHandler,
  answersHandler,
} = require("./handlers");

const { BOT_NAME, BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME });

bot.command("start", startHandler());

bot.action(...blankHandler());
bot.action(...createTestTable());
bot.action(...inlineTableHandler());
bot.action(...answersHandler());

bot.startPolling();
