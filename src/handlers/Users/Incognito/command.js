'use strict';

const { backButton, send } = require('../../../helpers');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'incognito',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    const status = ctx.user.settings.incognito;
    send(ctx, ctx.i18n.t(`settings.incognito.${status}`), [
      [
        {
          text: ctx.i18n.t(`menus.settings.incognito.${!status}`),
          callback_data: `incognito::${!status}`,
        },
      ],
      backButton(ctx, 'settings'),
    ]);
  }
};
