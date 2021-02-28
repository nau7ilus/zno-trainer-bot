'use strict';

const { send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'getTaskID',
      types: ['command'],
    });
  }
  run(ctx) {
    if (!ctx.session.currentTask) return send(ctx, ctx.i18n.t('tasks.skip.error'));
    return send(ctx, ctx.session.currentTask.id);
  }
};
