'use strict';

const Middleware = require('../structures/pieces/Middleware');

const requiredChannels = [-1001319499289];

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { name: 'checkFollow' });
  }

  async run(ctx, next) {
    if (ctx.updateType !== 'message' && ctx.updateType !== 'callback_query') return;

    const dontFollowed = [];
    for await (const chatID of requiredChannels) {
      try {
        const user = await ctx.telegram.getChatMember(chatID, ctx.from.id);
        if (!user || ['left', 'kicked', 'restricted'].includes(user.status)) {
          throw new Error('user not found');
        }
      } catch (err) {
        if (err.message.includes('chat not found')) continue;
        if (err.message.includes('user not found')) {
          const { title, username } = await ctx.telegram.getChat(chatID);
          dontFollowed.push({ title, username });
          continue;
        }
      }
    }

    if (dontFollowed.length > 0) {
      ctx.replyWithHTML(ctx.i18n.t('errors.requiredFollow', { dontFollowed }), {
        reply_markup: {
          inline_keyboard: [[{ text: ctx.i18n.t('menus.checkSubscribe'), callback_data: 'start' }]],
        },
      });
      return;
    }
    next();
  }
};
