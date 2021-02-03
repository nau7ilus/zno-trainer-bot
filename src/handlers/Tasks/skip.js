'use strict';

const { clearCache } = require('cachegoose');
const { send, backButton } = require('../../helpers');
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
  async run(ctx) {
    if (!ctx.session.currentTask) return ctx.replyWithHTML(ctx.i18n.t('tasks.skip.error'));

    ctx.telegram.sendMessage(
      logChannel,
      ctx.i18n.t('logs.skipGame', {
        task: ctx.session.currentTask,
      }),
      { parse_mode: 'HTML' },
    );

    clearCache(null, { id: ctx.from.id });
    await User.findOneAndUpdate({ id: ctx.from.id }, { $inc: { [`stats.${ctx.session.lobby}.totalAsked`]: 1 } });

    ctx.session.currentTask = undefined;
    ctx.session.askedAt = undefined;
    ctx.session.lobby = undefined;
    ctx.session.taskTag = undefined;
    ctx.session.backBtn = undefined;

    return send(ctx, ctx.i18n.t('tasks.skip.success'), [backButton(ctx, 'select::subject')]);
  }
};
