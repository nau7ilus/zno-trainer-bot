'use strict';

const { send, backButton } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'rating',
      types: ['action'],
    });
  }
  run(ctx) {
    send(ctx, ctx.i18n.t('rating.selectLobby'), [
      [{ text: ctx.i18n.t('rating.total'), callback_data: `rating::total::0` }],
      [
        { text: ctx.i18n.t('rating.algebra'), callback_data: `rating::algebra::0` },
        { text: ctx.i18n.t('rating.geometry'), callback_data: `rating::geometry::0` },
      ],
      backButton(ctx, 'start'),
    ]);
  }
};
