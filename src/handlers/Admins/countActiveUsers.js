'use strict';

const { send } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'countusers',
      types: ['command', 'action'],
    });
  }

  async run(ctx, userID) {
    if (!userID || ![546886852, 409482221].includes(ctx.from.id)) return;
    let activeUsers = 0;
    for await (const user of ctx.users) {
      // eslint-disable-next-line no-empty-function
      const data = await ctx.telegram.sendChatAction(user.id, 'typing').catch(err => {});
      if (data) {
        activeUsers += 1;
      }
    }

    console.log(activeUsers);
  }
};
