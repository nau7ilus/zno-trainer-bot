'use strict';

const axios = require('axios');

module.exports = async bot => {
  if (!process.env.CDN_URL) throw new Error('Не указана ссылка на сайт CDN');

  const res = await axios.get(`${process.env.CDN_URL}/config.json`);
  if (!res.data) throw new Error('Ошибка при запросе конфига');

  bot.context.tasks = res.data;
  console.log('[Config] Конфиг бота успешно обновлен.');
};
