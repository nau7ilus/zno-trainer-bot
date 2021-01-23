'use strict';

const { backButton, settingsMenu, send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'settings',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    send(ctx, ctx.i18n.t('settings.menu'), [...settingsMenu(ctx), backButton(ctx, 'start')]);
  }
};
