'use strict';

const { clearCache } = require('cachegoose');
const { send, handleRateLimit } = require('../../helpers');
const User = require('../../models/User');
const Handler = require('../../structures/pieces/Handler');

const logChannel = -1001467827834;

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'skip',
      types: ['command', 'action'],
    });
  }
  // eslint-disable-next-line consistent-return
  async run(ctx) {
    try {
      if (!ctx.session.currentTask) return ctx.replyWithHTML(ctx.i18n.t('tasks.skip.error'));

      if (!ctx.session.taskTag) {
        clearCache(null, { id: ctx.from.id });
        await User.findOneAndUpdate({ id: ctx.from.id }, { $inc: { [`stats.${ctx.session.lobby}.totalAsked`]: 1 } });
      }

      ctx.session.currentTask = undefined;
      ctx.session.askedAt = undefined;
      ctx.session.openTaskData = undefined;

      const backBtn = ctx.update?.callback_query?.message.entities
        ? ctx.update?.callback_query?.message.entities[0].url?.split('t.me/')[1]
        : ctx.session.backBtn;

      send(ctx, ctx.i18n.t('tasks.skip.success'), [
        [
          {
            text: ctx.i18n.t(`menus.${backBtn ? backBtn.split('::').slice(0, 3).join('::') : 'start'}.back`),
            callback_data: backBtn ?? 'start',
          },
          {
            text: ctx.i18n.t('tasks.next'),
            callback_data: `startGame::${ctx.session.lobby}${
              ctx.session?.taskTag ? `::${ctx.session.taskTag.join('::')}` : ''
            }`,
          },
        ],
      ]);

      await ctx.telegram.sendMessage(
        logChannel,
        ctx.i18n.t('logs.skipGame', {
          task: ctx.session.currentTask,
        }),
        { parse_mode: 'HTML' },
      );
    } catch (err) {
      if (err.code === 429) handleRateLimit(ctx, err);
      else console.error('[Error] Ошибка при пропуске задания', err);
    }
  }
};
