'use strict';

const { alphabet, nextTaskKeyboard } = require('../../../helpers');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^checkSimple(?:::(\w+))$/,
      types: ['action'],
    });
  }
  // eslint-disable-next-line consistent-return
  async run(ctx) {
    if (!ctx.session.currentTask) return ctx.replyWithHTML(ctx.i18n.t('tasks.skip.error'));

    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup();

    if (+ctx.match[1] === ctx.session.currentTask.answer) {
      if (!ctx.session.taskTag) {
        await User.findOneAndUpdate(
          { id: ctx.from.id },
          {
            $inc: {
              [`stats.${ctx.session.lobby}.totalAsked`]: 1,
              [`stats.${ctx.session.lobby}.correctAnswers`]: 1,
              [`stats.${ctx.session.lobby}.points`]: 1,
            },
          },
        );
      }

      if (!ctx.session.alreadyAsked) ctx.session.alreadyAsked = [];
      ctx.session.alreadyAsked.push(ctx.session.currentTask.id);
      ctx.replyWithHTML(
        ctx.i18n.t('tasks.simple.right', { answer: alphabet[+ctx.match[1]], backBtn: ctx.session.backBtn }),
        nextTaskKeyboard(ctx),
      );
    } else {
      if (!ctx.session.taskTag) {
        await User.findOneAndUpdate({ id: ctx.from.id }, { $inc: { [`stats.${ctx.session.lobby}.totalAsked`]: 1 } });
      }
      ctx.replyWithHTML(
        ctx.i18n.t('tasks.simple.wrong', {
          rightAnswer: alphabet[ctx.session.currentTask.answer],
          backBtn: ctx.session.backBtn,
        }),
        nextTaskKeyboard(ctx),
      );
    }

    ctx.session.currentTask = undefined;
    ctx.session.askedAt = undefined;
    ctx.session.lobby = undefined;
    ctx.session.taskTag = undefined;
  }
};
