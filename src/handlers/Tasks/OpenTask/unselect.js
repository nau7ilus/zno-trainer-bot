'use strict';

const OpenTask = require('../../../helpers/OpenTask');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^unselectAnswer(?:::(\w+))?(?:::(\w+))?$/,
      types: ['action'],
    });
  }
  // eslint-disable-next-line consistent-return
  run(ctx) {
    if (ctx.session?.currentTask?.id !== +ctx.match[2]) return ctx.answerCbQuery();

    const message = ctx.update.callback_query.message;
    const openTask = new OpenTask(ctx, ctx.session.currentTask, message);

    try {
      openTask.unselectAnswer(ctx.match[1]);
      ctx.editMessageReplyMarkup(openTask.keyboard.reply_markup);
    } catch (err) {
      console.error(err.message);
      ctx.answerCbQuery(ctx.i18n.t(err.message));
    }
  }
};
