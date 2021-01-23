'use strict';

const { clearCache } = require('cachegoose');
const { send, backButton } = require('../../../helpers');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^incognito(?:::(\w+))$/,
      types: ['action'],
    });
  }
  async run(ctx) {
    const changeTo = ctx.match[1] === 'true';

    clearCache(null, { id: ctx.from.id });
    await User.findOneAndUpdate({ id: ctx.from.id }, { 'settings.incognito': changeTo });

    send(ctx, ctx.i18n.t(`settings.incognito.${changeTo}`), [
      [
        {
          text: ctx.i18n.t(`menus.settings.incognito.${!changeTo}`),
          callback_data: `incognito::${!changeTo}`,
        },
      ],
      backButton(ctx, 'settings'),
    ]);
  }
};
