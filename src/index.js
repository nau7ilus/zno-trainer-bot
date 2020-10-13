/* eslint-disable capitalized-comments */
'use strict';

require('dotenv').config();

const { resolve } = require('path');
const cachegoose = require('cachegoose');
const mongoose = require('mongoose');
const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const LocalSession = require('telegraf-session-local');

const {
  router,
  startCommand,
  profileCommand,
  dropStats,
  confirmDrop,
  ratingCommand,
  incognitoAction,
  skipTask,
  createTask,
  languageCommand,
  languageAction,
  checkTableAnswers,
  selectTableCell,
  simpleTaskHandler,
} = require('./handlers');

const { BOT_NAME, BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME });
const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguage: 'uk',
  directory: resolve(__dirname, 'locales'),
  templateData: {
    pluralize: TelegrafI18n.pluralize,
  },
});

bot.use(new LocalSession({ database: 'sessions.json' }).middleware());
bot.use(i18n.middleware());

bot.command('start', startCommand());
bot.command('language', languageCommand());
bot.command('profile', profileCommand());
bot.command('skip', skipTask());
bot.command('rating', ratingCommand());
bot.command('dropstats', dropStats());

bot.action(...router());
bot.action(...languageAction());
bot.action(...createTask());
bot.action(...simpleTaskHandler());
bot.action(...incognitoAction());
bot.action(...confirmDrop());
bot.action(...checkTableAnswers());
bot.action(...selectTableCell());

// eslint-disable-next-line no-shadow
bot.help(({ replyWithHTML, i18n }) => replyWithHTML(i18n.t('help')));

bot.action('blank', ({ answerCbQuery, i18n: locales }) => {
  answerCbQuery(locales.t('errors.nothingThere'));
});

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
  err => {
    if (err) throw err;
    console.log('[Database] База данных Mongo успешно подключена.');
  },
);
