'use strict';

const Table = require('../../helpers/table');

module.exports = () => [
  /^table(?:::(\w+))?(?:::(\w+))?$/,
  async ctx => {
    try {
      const ctxTable = ctx.update.callback_query.message.reply_markup.inline_keyboard;
      const table = new Table({ keyboardBtns: ctxTable }).select(ctx.match[2], ctx.match[1]);

      const tableToKeyboard = table.toKeyboard();
      if (ctxTable === tableToKeyboard) return;

      await ctx.editMessageReplyMarkup(tableToKeyboard.reply_markup);
    } catch (err) {
      // Пропускаем ошибки
      ctx.answerCbQuery();
    }
  },
];
