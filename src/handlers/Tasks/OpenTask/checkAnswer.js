'use strict';

const { clearCache } = require('cachegoose');
const { nextTaskKeyboard } = require('../../../helpers');
const OpenTask = require('../../../helpers/OpenTask');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^checkOpenTask(?:::(\w+))?$/,
      types: ['action'],
    });
  }
  // eslint-disable-next-line consistent-return
  async run(ctx) {
    if (ctx.session?.currentTask?.id !== +ctx.match[1]) return ctx.answerCbQuery();

    const message = ctx.update.callback_query.message;
    const openTask = new OpenTask(ctx, ctx.session.currentTask, message);

    try {
      const correctAnswers = openTask.parseAnswers();
      if (correctAnswers.length === openTask.taskAnswers.length) {
        ctx.replyWithHTML(ctx.i18n.t('tasks.open.correct', { backBtn: ctx.session.backBtn }), nextTaskKeyboard(ctx));
        if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
        ctx.session.alreadyAsked.push(ctx.session.currentTask.id);
      } else if (correctAnswers.length === openTask.taskAnswers.length / 2) {
        ctx.replyWithHTML(ctx.i18n.t('tasks.open.half', { backBtn: ctx.session.backBtn }), nextTaskKeyboard(ctx));
      } else {
        ctx.replyWithHTML(ctx.i18n.t('tasks.open.incorrect', { backBtn: ctx.session.backBtn }), nextTaskKeyboard(ctx));
      }

      openTask.deactivateButtons();
      ctx.editMessageReplyMarkup(openTask.keyboard.reply_markup);

      clearCache(null, { id: ctx.from.id });
      await User.findOneAndUpdate(
        { id: ctx.from.id },
        {
          $inc: {
            [`stats.${ctx.session.lobby}.totalAsked`]: 1,
            [`stats.${ctx.session.lobby}.correctAnswers`]: correctAnswers.length / openTask.taskAnswers.length,
            [`stats.${ctx.session.lobby}.points`]: correctAnswers.length,
          },
        },
      );

      ctx.session.openTaskData = undefined;
      ctx.session.currentTask = undefined;
      ctx.session.askedAt = undefined;
      ctx.session.lobby = undefined;
      ctx.session.taskTag = undefined;

      ctx.client.saveSession(ctx);
    } catch (err) {
      console.error(err.message);
      ctx.answerCbQuery(ctx.i18n.t(err.message));
    }
  }
};
