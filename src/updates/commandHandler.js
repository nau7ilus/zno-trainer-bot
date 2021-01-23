'use strict';

const Update = require('../structures/pieces/Update');

module.exports = class extends Update {
  constructor(...args) {
    super(...args, {
      name: 'commandHandler',
      type: 'message',
    });
  }

  run(ctx) {
    const message = ctx.message;

    // Checking if it's a command (starts with prefix)
    if (!message.text.startsWith('/')) return;

    // Find command in handlers store by name
    const cmdName = message.text.slice(1);
    const cmd = ctx.client.handlers.find(c => c.name === cmdName);

    // Run command or return error message
    if (!cmd) ctx.replyWithHTML(ctx.i18n.t('errors.commandNotFound'));
    else cmd.run(ctx, message);
  }
};
