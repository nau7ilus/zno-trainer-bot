'use strict';

const { alphabet, send, handleRateLimit } = require('../../helpers');
const { Tasks } = require('../../helpers/enums');
const Handler = require('../../structures/pieces/Handler');

const logChannel = -1001467827834;
const parseHTML = { parse_mode: 'HTML' };
const subjectIDs = {
  total: 0,
  algebra: 1,
  geometry: 2,
};

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^startGame(?:::(\w+))?(?:::(\w+))?(?:::(\w+))?$/,
      types: ['action'],
    });
  }

  // eslint-disable-next-line consistent-return
  run(ctx) {
    try {
      ctx.answerCbQuery();
      const backBtn = ctx.session.backBtn
        ? ctx.session.backBtn
        : ctx.update?.callback_query?.message.entities[0].url?.split('t.me/')[1];

      ctx.session.backBtn = backBtn ?? 'start';

      // Check if user already has active task
      if (ctx.session.currentTask) {
        return send(ctx, ctx.i18n.t('errors.activeTask'), [
          [{ text: ctx.i18n.t('menus.settings.skipTask'), callback_data: 'skip' }],
          [
            {
              text: ctx.i18n.t(`menus.${backBtn ? backBtn.split('::').slice(0, 3).join('::') : 'start'}.back`),
              callback_data: backBtn ?? 'start',
            },
          ],
        ]);
      }

      const subject = subjectIDs[ctx.match[1]];
      const subjectQuery = subject === 0 ? [1, 2] : [subject];

      const tasks = ctx.tasks
        .filter(i => subjectQuery.includes(i.subject))
        .filter(i => (ctx.match[2] ? i.tag[0] === +ctx.match[2] && i.tag[1] === +ctx.match[3] : true))
        .filter(i => i.id !== ctx.session.alreadyAsked);

      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

      ctx.session.currentTask = randomTask;
      ctx.session.askedAt = Date.now();
      ctx.session.lobby = ctx.match[1];
      if (ctx.match[2] && ctx.match[3]) ctx.session.taskTag = [ctx.match[2], ctx.match[3]];

      ctx.client.saveSession(ctx);

      const theme = ctx.i18n.t(
        `themes.${Object.keys(subjectIDs)[randomTask.subject]}.${randomTask.tag[0]}.${randomTask.tag[1] + 1}`,
      );
      ctx.telegram.sendMessage(
        logChannel,
        ctx.i18n.t('logs.newGame', {
          randomTask,
          theme,
          alphabet,
          CDN_URL: process.env.CDN_URL,
        }),
        parseHTML,
      );

      ctx.editMessageReplyMarkup();

      if (randomTask.taskType === Tasks.Table) ctx.client.handlers.get('sendTableTask').run(ctx, randomTask);
      else if (randomTask.taskType === Tasks.Open) ctx.client.handlers.get('sendOpenTask').run(ctx, randomTask);
      else if (randomTask.taskType === Tasks.Structurized) ctx.client.handlers.get('sendOpenTask').run(ctx, randomTask);
      else if (randomTask.taskType === Tasks.Base) ctx.client.handlers.get('sendSimpleTask').run(ctx, randomTask);
    } catch (err) {
      if (err.code === 429) handleRateLimit(ctx, err);
      else console.error('[Error] Ошибка при создании игры', err);
    }
  }
};
