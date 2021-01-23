'use strict';

const Log = require('../models/Log');
const Middleware = require('../structures/pieces/Middleware');

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { name: 'logActivity' });
  }

  async run(ctx, next) {
    // eslint-disable-next-line callback-return
    next();

    try {
      // Узнаем тип действия
      const actionType = ctx.message ? 0 : 1;

      // Получаем контент команды, исходя из типа отправки
      const commandContent = ctx.message ? ctx.message.text : ctx.update.callback_query.data;
      const details = ctx.message ? [commandContent.split('/')[1]] : commandContent.split('::');

      await Log.create({ actionType, userID: ctx.from.id, details });
    } catch (err) {
      console.error('[Error] Ошибка при добавлении данных в статистику', err);
    }
  }
};
