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

  async run(ctx, userID) {
    try {
      if (!userID || ![546886852, 409482221].includes(ctx.from.id)) return;

      const userDB = ctx.user;
      const userData = await ctx.telegram.getChat(userID);

      send(ctx, ctx.i18n.t('getUser', { userID, userDB, userData }), [backButton(ctx, 'start')]);
    } catch (err) {
      if (err.message.includes('chat not found')) {
        send(ctx, ctx.i18n.t('errors.userBlocked'));
      } else {
        console.error(err);
      }
    }
  }
};
