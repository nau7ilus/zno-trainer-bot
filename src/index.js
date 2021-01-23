/* eslint-disable capitalized-comments */
'use strict';

require('dotenv').config();

const connectDatabase = require('./helpers/connectDatabase');
const updateConfig = require('./helpers/updateConfig');
const Client = require('./structures/Client');

const { BOT_NAME, BOT_TOKEN } = process.env;
const bot = new Client(BOT_TOKEN, { username: BOT_NAME });

connectDatabase(err => {
  if (err) throw err;
  console.log('[Database] База данных Mongo успешно подключена.');
});
updateConfig(bot);
