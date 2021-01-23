'use strict';

const { clearCache } = require('cachegoose');
const { send, backButton } = require('../../../helpers');
const User = require('../../../models/User');
const Handler = require('../../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: /^language(?:::(\w+))$/,
      types: ['action'],
    });
  }
  async run(ctx) {
    ctx.i18n.locale(ctx.match[1]);
    ctx.session.__language_code = ctx.match[1];

    if (!ctx.user.isLanguageSet) {
      clearCache(null, { id: ctx.from.id });
      await User.findOneAndUpdate({ id: ctx.from.id }, { isLanguageSet: true });
    }

    send(ctx, ctx.i18n.t('languages.success'), [backButton(ctx, 'start'), backButton(ctx, 'settings')]);
  }
};
