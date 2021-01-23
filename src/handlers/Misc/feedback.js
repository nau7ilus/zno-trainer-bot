'use strict';

const { backButton, send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'feedback',
      types: ['command', 'action'],
    });
  }

  run(ctx) {
    send(ctx, ctx.i18n.t('feedback.message'), [
      [
        {
          text: ctx.i18n.t('feedback.prBtn'),
          url: `https://t.me/mwell7`,
        },
        {
          text: ctx.i18n.t('feedback.techBtn'),
          url: `https://t.me/nieopierzony`,
        },
      ],
      backButton(ctx, 'start'),
    ]);
  }
};
