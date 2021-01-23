'use strict';

const User = require('../models/User');
const Middleware = require('../structures/pieces/Middleware');

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { name: 'cacheUser' });
  }

  async run(ctx, next) {
    if (ctx.updateType !== 'message' && ctx.updateType !== 'callback_query') return;

    const id = ctx.from.id;
    const author = await User.findOne({ id })
      .cache(60, `users_${id}`)
      .then(p => p || User.create({ id }));

    const users = await User.find().cache(60, 'users');

    ctx.users = users;
    ctx.user = author;

    next();
  }
};
