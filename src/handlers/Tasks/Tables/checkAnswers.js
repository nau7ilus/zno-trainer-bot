'use strict';

const { clearCache } = require('cachegoose');
const { nextTaskKeyboard } = require('../../../helpers');
const Table = require('../../../helpers/Table');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'checkTable',
      types: ['action'],
    });
  }
  // eslint-disable-next-line consistent-return
  async run(ctx) {
    try {
      if (!ctx.session.currentTask) return ctx.replyWithHTML(ctx.i18n.t('tasks.skip.error'));

      const ctxTable = ctx.update.callback_query.message.reply_markup.inline_keyboard;
      const table = new Table({ keyboardBtns: ctxTable });
      table.rows.splice(-1, 1);

      const points = table.countPoints(ctx.session.currentTask.answer);
      const correctAnswersPercent = (points / ctx.session.currentTask.answer.length) * 100;

      if (correctAnswersPercent >= 100) {
        if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
        ctx.session.alreadyAsked.push(ctx.session.currentTask.id);
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.table.absolutely', { points, backBtn: ctx.session.backBtn }),
          nextTaskKeyboard(ctx),
        );
      } else if (correctAnswersPercent >= 75) {
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.table.great', { points, backBtn: ctx.session.backBtn }),
          nextTaskKeyboard(ctx),
        );
      } else if (correctAnswersPercent >= 1) {
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.table.ok', { points, backBtn: ctx.session.backBtn }),
          nextTaskKeyboard(ctx),
        );
      } else {
        ctx.replyWithHTML(
          ctx.i18n.t('tasks.table.bad', { points, backBtn: ctx.session.backBtn }),
          nextTaskKeyboard(ctx),
        );
      }

      table.rows.pop();
      table.writeAnswers(ctx.session.currentTask.answer);
      ctx.editMessageReplyMarkup({ inline_keyboard: table.rows });

      clearCache(null, { id: ctx.from.id });
      await User.findOneAndUpdate(
        { id: ctx.from.id },
        {
          $inc: {
            [`stats.${ctx.session.lobby}.totalAsked`]: 1,
            [`stats.${ctx.session.lobby}.correctAnswers`]: correctAnswersPercent / 100,
            [`stats.${ctx.session.lobby}.points`]: points,
          },
        },
      );

      ctx.session.currentTask = undefined;
      ctx.session.askedAt = undefined;
      ctx.session.lobby = undefined;
      ctx.session.taskTag = undefined;
    } catch (err) {
      ctx.answerCbQuery(ctx.i18n.t(err.message));
      console.error(err);
    }
  }
};
