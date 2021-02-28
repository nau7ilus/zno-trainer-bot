'use strict';

const { clearCache } = require('cachegoose');
const User = require('../models/User');
const Middleware = require('../structures/pieces/Middleware');

const parseHTML = { parse_mode: 'HTML' };
const channels = {
  newUsers: -1001372674070,
  common: -1001340384906,
  games: -1001467827834,
};

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { name: 'logActivity' });
  }

  async run(ctx, next) {
    try {
      // Узнаем тип действия
      const actionType = ctx.update.message ? 0 : 1;
      if (actionType === 0 && !ctx.update.message.text.startsWith('/')) return;

      // Получаем контент команды, исходя из типа отправки
      const commandContent = ctx.update.message ? ctx.update.message.text : ctx.update.callback_query.data;
      const details = ctx.update.message ? commandContent.split('/')[1].split(/ +/g) : commandContent.split('::');
      const btnName = ctx.update?.callback_query?.message.reply_markup.inline_keyboard
        .flat()
        .find(i => i.callback_data === commandContent).text;

      if (ctx.user.isFirstRun) {
        clearCache(null, { id: ctx.from.id });
        await User.findOneAndUpdate({ id: ctx.from.id }, { isFirstRun: false });

        ctx.telegram.sendMessage(
          channels.newUsers,
          ctx.i18n.t('logs.newUser', { commandContent, actionType, details }),
          parseHTML,
        );
      }

      if (details[0] === 'start' && details[1]?.startsWith('getuser')) {
        const userID = details[1].split('-')[1];
        const cmd = ctx.client.handlers.get('getuser');
        cmd.run(ctx, userID);
        return;
      }

      ctx.telegram.sendMessage(
        channels.common,
        ctx.i18n.t('logs.common', { commandContent, actionType, btnName, user: ctx.user }),
        parseHTML,
      );
    } catch (err) {
      console.error('[Error] Ошибка при добавлении данных в статистику', err);
    }

    next();
  }
};
