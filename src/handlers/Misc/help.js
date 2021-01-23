'use strict';

const { backButton, send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'help',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    send(ctx, ctx.i18n.t('help'), [backButton(ctx, 'start')]);
  }
};
