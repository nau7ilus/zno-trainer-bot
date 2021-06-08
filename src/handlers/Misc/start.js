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
      const toExam = Math.round((new Date('2022-05-28').getTime() - Date.now()) / (1000 * 3600 * 24));
      send(ctx, ctx.i18n.t('greeting.other', { toExam }), mainMenu(ctx));
    }
  }
};
