'use strict';

const { backButton, send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'getuser',
      types: ['command', 'action'],
    });
  }

  run(ctx, userID) {
    if (!userID || ![].includes(ctx.from.id)) return;
    send(ctx, ctx.i18n.t('getUser', { userID }), [backButton(ctx, 'start')]);
  }
};
