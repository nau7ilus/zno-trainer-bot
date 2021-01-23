'use strict';

const { mainMenu, languagesMenu, send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'start',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    if (!ctx.user.isLanguageSet) {
      send(ctx, ctx.i18n.t('greeting.firstTime'), languagesMenu);
    } else {
      send(ctx, ctx.i18n.t('greeting.other'), mainMenu(ctx));
    }
  }
};
