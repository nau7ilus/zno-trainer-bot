'use strict';

const Table = require('../../../helpers/Table');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^selectCell(?:::(\w+))?(?:::(\w+))?$/,
      types: ['action'],
    });
  }
  async run(ctx) {
    try {
      const ctxTable = ctx.update.callback_query.message.reply_markup.inline_keyboard;
      const table = new Table({ keyboardBtns: ctxTable });

      await ctx.editMessageReplyMarkup({ inline_keyboard: table.select(ctx.match[2], ctx.match[1]).rows });
    } catch (err) {
      ctx.answerCbQuery();
      console.error(err);
    }
  }
};
