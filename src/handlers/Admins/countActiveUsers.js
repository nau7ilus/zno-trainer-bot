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

    const activeUsers = [];
    for await (const user of ctx.users) {
      // eslint-disable-next-line no-empty-function
      const data = await ctx.telegram.getChat(user.id).catch(() => {});
      if (data) {
        console.log(data);
        activeUsers.push(data);
      }
    }

    console.log(activeUsers);
    console.log(activeUsers.length);
  }
};
